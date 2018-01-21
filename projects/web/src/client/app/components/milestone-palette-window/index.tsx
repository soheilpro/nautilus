import * as React from 'react';
import { IMilestone } from '../../application';
import { Window } from '../../framework/components/window';
import { Heading } from '../../framework/components/heading';
import { List } from '../../framework/components/list';
import { MilestoneField } from '../milestone-field';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface IMilestonePaletteWindowProps {
  milestones: IMilestone[];
  onSelect(milestone: IMilestone): void;
}

interface IMilestonePaletteWindowState {
}

export class MilestonePaletteWindow extends React.PureComponent<IMilestonePaletteWindowProps, IMilestonePaletteWindowState> {
  constructor() {
    super();

    this.handleListRenderItem = this.handleListRenderItem.bind(this);
  }

  private handleListRenderItem(milestone: IMilestone): JSX.Element {
    return (
      <MilestoneField milestone={milestone} />
    );
  }

  render(): JSX.Element {
    return (
      <Window className="milestone-palette-window-component">
        <Heading className="heading" level={1}>Set issue milestone</Heading>
        <List className="list" items={this.props.milestones} keyForItem={(milestone: IMilestone) => milestone.id} titleForItem={(milestone: IMilestone) => milestone.fullTitle} renderItem={this.handleListRenderItem} onSelect={this.props.onSelect} />
      </Window>
    );
  }
}
