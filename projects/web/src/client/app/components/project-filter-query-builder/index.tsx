import * as React from 'react';
import * as NQL from '../../nql';
import { AndQueryBuilder, IQueryBuilder } from '../and-query-builder';

interface IProjectFilterQueryBuilderProps {
  query: NQL.IExpression;
  onChange(query: NQL.IExpression): void;
}

interface IProjectFilterQueryBuilderState {
}

export class ProjectFilterQueryBuilder extends React.PureComponent<IProjectFilterQueryBuilderProps, IProjectFilterQueryBuilderState> {
  private andQueryBuilderRef: AndQueryBuilder;

  constructor() {
    super();

    this.state = {};
  }

  componentDidMount(): void {
    this.setState({});
  }

  open(key: string): void {
    this.andQueryBuilderRef.open(key);
  }

  render(): JSX.Element {
    const queryBuilders: IQueryBuilder[] = [];

    return (
      <AndQueryBuilder queryBuilders={queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderRef = e} />
    );
  }
}
