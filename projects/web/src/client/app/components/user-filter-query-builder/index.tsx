import * as React from 'react';
import * as NQL from '../../nql';
import { AndQueryBuilder, IQueryBuilder } from '../and-query-builder';

interface IUserFilterQueryBuilderProps {
  query: NQL.IExpression;
  onChange(query: NQL.IExpression): void;
}

interface IUserFilterQueryBuilderState {
}

export class UserFilterQueryBuilder extends React.PureComponent<IUserFilterQueryBuilderProps, IUserFilterQueryBuilderState> {
  private andQueryBuilderComponent: AndQueryBuilder;

  constructor() {
    super();

    this.state = {};
  }

  componentDidMount(): void {
    this.setState({});
  }

  open(key: string): void {
    this.andQueryBuilderComponent.open(key);
  }

  render(): JSX.Element {
    const queryBuilders: IQueryBuilder[] = [];

    return (
      <AndQueryBuilder queryBuilders={queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderComponent = e} />
    );
  }
}
