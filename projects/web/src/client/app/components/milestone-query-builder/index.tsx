import * as React from 'react';
import * as NQL from '../../nql';
import { IMilestone, asEntity, entityComparer } from '../../application';
import { ListQueryBuilder } from '../list-query-builder';

interface IMilestoneQueryBuilderProps {
  milestones: IMilestone[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IMilestoneQueryBuilderState {
}

export class MilestoneQueryBuilder extends React.PureComponent<IMilestoneQueryBuilderProps, IMilestoneQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: string): boolean {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'Milestone');
  }

  render(): JSX.Element {
    return (
      <ListQueryBuilder items={this.props.milestones} keyForItem={(item: IMilestone) => item.id} titleForItem={(item: IMilestone) => item.fullTitle} query={this.props.query} queryItem={this.props.queryItem} queryItemType="Milestone" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
}
