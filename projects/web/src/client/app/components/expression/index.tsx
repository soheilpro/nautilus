import * as React from 'react';
import * as NQL from '../../nql';
import { ServiceManager } from '../../services';
import HTMLExpressionFormatter from './html-expression-formatter';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IExpressionProps {
  expression: NQL.IExpression;
}

interface IExpressionState {
}

export default class Expression extends React.PureComponent<IExpressionProps, IExpressionState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    return (
      <div className="expression-component">
        {
          this.props.expression &&
            <span dangerouslySetInnerHTML={{ __html: new HTMLExpressionFormatter(this.application).format(this.props.expression, null) }} />
        }
      </div>
    );
  }
};
