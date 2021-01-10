import React from 'react';
import Button from 'react-bootstrap/Button';
import firebase from '../../firebase.js';

// Mark top-level post and thread as seen

export default class MarkAsSeenButton extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    const { postId, userId } = this.props;

    const errors = [];
    if (!postId) {
      errors.push('action requires postId');
    }
    if (!userId) {
      errors.push('action requires userId');
    }
    if (errors.length > 0) {
      errors.forEach((error) => {
        console.error(error);
      });
      return;
    }

    const postRef = firebase
      .database()
      .ref('posts/' + this.props.postId + '/seen/' + this.props.userId);
    postRef.set(firebase.database.ServerValue.TIMESTAMP);
  }
  render() {
    return (
      <Button onClick={this.handleClick} className="mt-2 float-right">
        Mark As Seen
      </Button>
    );
  }
}
