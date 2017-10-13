import * as React from 'react';
import * as blueimpmd5 from 'blueimp-md5';
import { IUser } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAvatarProps {
  user?: IUser;
  size?: number;
}

interface IAvatarState {
}

export default class Avatar extends React.PureComponent<IAvatarProps, IAvatarState> {
  public static defaultProps: IAvatarProps = {
    size: 50
  };

  render() {
    const md5: any = blueimpmd5;
    const emailHash = md5(this.props.user.email);
    const size = this.props.size * 2;

    return (
      <div className="avatar-component">
        <img className="image" src={`https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=identicon`} width={this.props.size} height={this.props.size} />
      </div>
    );
  }
};
