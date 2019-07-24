import * as React from 'react';
import * as classNames from 'classnames';
import { UserState } from '../../application';
import { Select } from '../../framework/components/select';

interface IUserStateSelectProps {
  state: UserState;
  className?: string;
  onChange(state: UserState): void;
}

interface IUserStateSelectState {
}

export class UserStateSelect extends React.PureComponent<IUserStateSelectProps, IUserStateSelectState> {
  render(): JSX.Element {
    return (
      <Select className={classNames('user-state-select-component', this.props.className)} selectedItem={this.props.state} items={['enabled', 'disabled']} keyForItem={(state: UserState) => state} titleForItem={(state: UserState) => state} onChange={this.props.onChange} />
    );
  }
}
