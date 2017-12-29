import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import * as NQL from '../../nql';
import { Dropdown } from '../../framework/components/dropdown';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IQueryBuilderProps {
  query?: NQL.IExpression;
  queryItem: string;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

declare class QueryBuilder extends React.PureComponent<IQueryBuilderProps, {}> {
  static canParseQuery(query: NQL.IExpression, queryItem: string): void;
}

export interface IQueryBuilder {
  key: string;
  title: string;
  queryItem: string;
  Component: typeof QueryBuilder;
  props?: Object;
}

interface IQueryObject {
  [key: string]: NQL.IExpression;
}

interface IAndQueryBuilderProps {
  queryBuilders: IQueryBuilder[];
  query: NQL.IExpression;
  onChange(query: NQL.IExpression): void;
}

interface IAndQueryBuilderState {
  queries?: IQueryObject;
}

export class AndQueryBuilder extends React.PureComponent<IAndQueryBuilderProps, IAndQueryBuilderState> {
  private dropdownComponents: { [key: string]: Dropdown } = {};

  constructor(props: IAndQueryBuilderProps) {
    super(props);

    this.handleFilterChange = this.handleFilterChange.bind(this);

    this.state = {
      queries: this.getQueryObject(props.query) || {},
    };
  }

  componentWillReceiveProps(props: IAndQueryBuilderProps): void {
    if (props.query !== this.props.query) {
      this.setState({
        queries: this.getQueryObject(props.query) || {},
      });
    }
  }

  open(key: string): void {
    this.dropdownComponents[key].open();
  }

  private getQueryObject(query: NQL.IExpression): IQueryObject {
    if (!query)
      return null;

    const children = [...(query as NQL.AndExpression).children];
    const queries: IQueryObject = {};

    for (const child of children) {
      for (const queryBuilder of this.props.queryBuilders) {
        if (queryBuilder.Component.canParseQuery(child, queryBuilder.queryItem)) {
          queries[queryBuilder.key] = child;
          break;
        }
      }
    }

    return queries;
  }

  private handleFilterChange(key: string, query: NQL.IExpression, reset: boolean, done: boolean): void {
    const queries: IQueryObject = reset ? {} : {...this.state.queries};

    if (query)
      queries[key] = query;
    else
      delete queries[key];

    this.setState({
      queries: queries,
    });

    if (done)
      this.dropdownComponents[key].close();

    this.props.onChange(this.getQuery(queries));
  }

  private getQuery(queries: IQueryObject): NQL.IExpression {
    const queryValues = _.values(queries);

    if (queryValues.length === 0)
      return null;

    return new NQL.AndExpression(queryValues);
  }

  render(): JSX.Element {
    return (
      <div className="and-query-builder-component">
        <div className="query-builders">
          {
            this.props.queryBuilders.map(queryBuilder => {
              return (
                <Dropdown className={classNames('query-builder', { 'active': !!this.state.queries[queryBuilder.key] })} title={queryBuilder.title} ref={e => this.dropdownComponents[queryBuilder.key] = e} key={queryBuilder.key}>
                  <div className="container">
                    <queryBuilder.Component query={this.state.queries[queryBuilder.key]} queryItem={queryBuilder.queryItem} onChange={_.partial(this.handleFilterChange, queryBuilder.key)} {...queryBuilder.props} />
                  </div>
                </Dropdown>
              );
            })
          }
        </div>
      </div>
    );
  }
}
