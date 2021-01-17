import React from 'react';
import { AppContext } from '../AppProvider';
import { hasMyUpvote, upvoteCount, toggleUpvote } from '../shared/db';

const redditRed = '#fd5828';

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
      <div
        style={{
          color: this.state.hasMyUpvote ? redditRed : 'inherit',
        }}
      >
        <small
          onClick={() => toggleUpvote({ postId, userId })}
          style={{ fontWeight: 600, cursor: 'pointer' }}
          // className="text-muted"
        >
          &#8593; {this.state.count}
        </small>
      </div>
    );
  }
}
