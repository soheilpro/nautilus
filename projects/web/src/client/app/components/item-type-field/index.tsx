import * as React from 'react';
import * as classNames from 'classnames';
import { IItemType } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemTypeFieldProps {
  itemType: IItemType;
  className?: string;
}

interface IItemTypeFieldState {
}

export default class ItemTypeField extends React.PureComponent<IItemTypeFieldProps, IItemTypeFieldState> {
  render(): JSX.Element {
    if (!this.props.itemType)
      return null;

    return (
      <span className={classNames('item-type-field-component', this.props.className)}>
        {this.props.itemType.title}
      </span>
    );
  }
}
