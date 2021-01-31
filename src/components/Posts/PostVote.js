import React from 'react';
import { AppContext } from '../AppProvider';
import { hasMyUpvote, upvoteCount, toggleUpvote } from '../../api/index';
import { PostMenuBarItem } from './Post';

export class Upvote extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      hasMyUpvote: false,
    };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    const { postId } = this.props;
    const userId = this.user().uid;

    hasMyUpvote({ postId, userId }, (hasMyUpvote) =>
      this.setState({
        hasMyUpvote,
      })
    );

    upvoteCount({ postId }, (count) =>
      this.setState({
        count,
      })
    );
  }

  render() {
    const { postId } = this.props;
    const userId = this.user().uid;

    return (
      <PostMenuBarItem
        onClick={() => toggleUpvote({ postId, userId })}
        active={this.state.hasMyUpvote}
      >
        &#8593; {this.state.count}
      </PostMenuBarItem>
    );
  }
}
