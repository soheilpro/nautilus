import * as _ from 'underscore';
import * as NQL from '../../nql';
import { IClient, IItem, IItemRelationship, IItemChange } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { IProject, entityComparer } from '../';
import { IItemModule } from './iitem-module';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { IMilestone } from './imilestone';
import { IMilestoneChange } from './imilestone-change';
import { Milestone } from './milestone';
import { Issue } from './issue';
import { MilestoneExpressionNormalizer } from './milestone-expression-normalizer';
import { IssueExpressionNormalizer } from './issue-expression-normalizer';

export class ItemModule extends BaseModule implements IItemModule {
  private issues: IIssue[];
  private milestones: IMilestone[];
  private relationships: IItemRelationship[];
  private issuesMap: { [id: string]: IIssue };
  private milestonesMap: { [id: string]: IMilestone };
  private relationship1Map: { [id: string]: IItemRelationship[] };
  private relationship2Map: { [id: string]: IItemRelationship[] };

  constructor(private application: IApplication, private client: IClient) {
    super();
  }

  async load(): Promise<void> {
    const result = await this.client.items.get(null, ['relationships']);

    this.issues = [];
    this.milestones = [];
    this.relationships = result.relationships;
    this.issuesMap = {};
    this.milestonesMap = {};
    this.relationship1Map = {};
    this.relationship2Map = {};

    for (const entity of result.entities) {
      switch (entity.kind) {
        case 'issue':
          const issue = new Issue(entity, this.application);
          this.issues.push(issue);
          this.issuesMap[issue.id] = issue;
          break;

        case 'milestone':
          const milestone = new Milestone(entity, this.application);
          this.milestones.push(milestone);
          this.milestonesMap[milestone.id] = milestone;
          break;
      }
    }

    for (const relationship of this.relationships) {
      this.relationship1Map[relationship.item1.id] = [...this.relationship1Map[relationship.item1.id] || [], relationship];
      this.relationship2Map[relationship.item2.id] = [...this.relationship2Map[relationship.item2.id] || [], relationship];
    }
  }

  getAllIssues(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): Promise<IIssue[]> {
    let issues = [...this.issues];

    const expressionNormalizer = new IssueExpressionNormalizer();

    if (filterExpression)
      issues = this.filter(issues, filterExpression, expressionNormalizer);

    if (sortExpressions)
      issues = this.sort(issues, sortExpressions, expressionNormalizer);

    return Promise.resolve(issues);
  }

  getIssue(item: IItem): Promise<IIssue> {
    return Promise.resolve(item ? this.issuesMap[item.id] : null);
  }

  getIssueParent(issue: IIssue): IIssue {
    const relationship = _.find(this.relationship1Map[issue.id], relationship => relationship.type === 'parent');

    if (!relationship)
      return null;

    return this.issuesMap[relationship.item2.id];
  }

  getIssueMilestone(issue: IIssue): IMilestone {
    const relationship = _.find(this.relationship1Map[issue.id], relationship => relationship.type === 'milestone');

    if (!relationship)
      return null;

    return this.milestonesMap[relationship.item2.id];
  }

  async addIssue(issue: IIssue, parentIssue?: IIssue): Promise<IIssue> {
    const newItem: IItem = {
      kind: 'issue',
      type: issue.type,
      title: issue.title,
      description: issue.description,
      state: issue.state,
      tags: issue.tags,
      project: issue.project,
      assignedTo: issue.assignedTo,
    };

    const addedIssue = new Issue(await this.client.items.insert(newItem), this.application);

    this.issues.push(addedIssue);
    this.issuesMap[addedIssue.id] = addedIssue;

    if (parentIssue) {
      let relationship: IItemRelationship = {
        item1: addedIssue,
        item2: parentIssue,
        type: 'parent',
      };

      await this.addRelationship(relationship);
    }

    if (issue.milestone) {
      let relationship: IItemRelationship = {
        item1: addedIssue,
        item2: issue.milestone,
        type: 'milestone',
      };

      await this.addRelationship(relationship);
    }

    this.emit('issue.add', { issue: addedIssue });

    return addedIssue;
  }

  async updateIssue(issue: IIssue, issueChange: IIssueChange): Promise<IIssue> {
    const change: IItemChange = {
      type: issueChange.type,
      title: issueChange.title,
      description: issueChange.description,
      state: issueChange.state,
      tags: issueChange.tags,
      project: issueChange.project,
      assignedTo: issueChange.assignedTo,
    };

    const updatedIssue = new Issue(await this.client.items.update(issue.id, change), this.application);

    this.issues[this.issues.indexOf(issue)] = updatedIssue;
    this.issuesMap[updatedIssue.id] = updatedIssue;

    if (issueChange.milestone !== undefined) {
      if (issue.milestone) {
        const relationship = _.find(this.relationship1Map[issue.id], relationship => relationship.type === 'milestone');

        await this.deleteRelationship(relationship);
      }

      if (issueChange.milestone) {
        let relationship: IItemRelationship = {
          item1: updatedIssue,
          item2: issueChange.milestone,
          type: 'milestone',
        };

        await this.addRelationship(relationship);
      }
    }

    this.emit('issue.update', { issue: updatedIssue });

    return updatedIssue;
  }

  async deleteIssue(issue: IIssue): Promise<void> {
    await this.client.items.delete(issue.id);

    this.issues.splice(this.issues.indexOf(issue), 1);
    delete this.issuesMap[issue.id];

    for (const relationship of this.relationships.filter(relationship => relationship.item1.id === issue.id || relationship.item2.id === issue.id))
      this.deleteRelationship(relationship);

    this.emit('issue.delete', { issue: issue });
  }

  getAllMilestones(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): IMilestone[] {
    let milestones = [...this.milestones];

    const expressionNormalizer = new MilestoneExpressionNormalizer();

    if (filterExpression)
      milestones = this.filter(milestones, filterExpression, expressionNormalizer);

    if (sortExpressions)
      milestones = this.sort(milestones, sortExpressions, expressionNormalizer);

    return milestones;
  }

  getMilestone(milestone: IItem): IMilestone {
    if (!milestone)
      return null;

    return this.milestonesMap[milestone.id];
  }

  async addMilestone(milestone: IMilestone): Promise<IMilestone> {
    const newMilestone: IItem = {
      kind: 'milestone',
      title: milestone.title,
      description: milestone.description,
      state: milestone.state,
      project: milestone.project,
    };

    const addedMilestone = new Milestone(await this.client.items.insert(newMilestone), this.application);
    this.milestones.push(addedMilestone);
    this.milestonesMap[addedMilestone.id] = addedMilestone;

    this.emit('milestone.add', { milestone: addedMilestone });

    return addedMilestone;
  }

  async updateMilestone(milestone: IMilestone, milestoneChange: IMilestoneChange): Promise<IMilestone> {
    const change: IItemChange = {
      title: milestoneChange.title,
      description: milestoneChange.description,
      state: milestoneChange.state,
      project: milestoneChange.project,
    };

    const updatedMilestone = new Milestone(await this.client.items.update(milestone.id, change), this.application);

    this.milestones[this.milestones.indexOf(milestone)] = updatedMilestone;
    this.milestonesMap[updatedMilestone.id] = updatedMilestone;

    this.emit('milestone.update', { milestone: updatedMilestone });

    return updatedMilestone;
  }

  async deleteMilestone(milestone: IMilestone): Promise<void> {
    await this.client.items.delete(milestone.id);

    this.milestones.splice(this.milestones.indexOf(milestone), 1);
    delete this.milestonesMap[milestone.id];

    this.emit('milestone.delete', { milestone: milestone });
  }

  filterValidMilestonesForProject(milestones: IMilestone[], project: IProject): IMilestone[] {
    if (!project)
      return [];

    return milestones
      .filter(milestone => milestone.state && milestone.state.key !== 'closed')
      .filter(milestone => !milestone.project || entityComparer(milestone.project, project));
  }

  private async addRelationship(relationship: IItemRelationship): Promise<void> {
    const addedRelationship = await this.client.itemRelationships.insert(relationship);

    this.relationships.push(addedRelationship);
    this.relationship1Map[addedRelationship.item1.id] = [...this.relationship1Map[addedRelationship.item1.id] || [], addedRelationship];
    this.relationship2Map[addedRelationship.item2.id] = [...this.relationship2Map[addedRelationship.item2.id] || [], addedRelationship];
  }

  private async deleteRelationship(relationship: IItemRelationship): Promise<void> {
    await this.client.itemRelationships.delete(relationship.id);

    this.relationships.splice(this.relationships.indexOf(relationship), 1);
    this.relationship1Map[relationship.item1.id].splice(this.relationship1Map[relationship.item1.id].indexOf(relationship), 1);
    this.relationship2Map[relationship.item2.id].splice(this.relationship2Map[relationship.item2.id].indexOf(relationship), 1);
  }
}
