import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AppContext } from '../AppProvider';

export default class NewPostForm extends React.Component {
  constructor() {
    super();
    this.state = {
      content: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  static contextType = AppContext;
  user = () => this.context.user;

  handleChange(event) {
    const newValue = event.target.value;
    if (
      this.props.characterLimit &&
      newValue.length > this.props.characterLimit
    ) {
      return;
    }
    this.setState({ content: newValue });
  }
  render() {
    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (this.state.content === '') {
            return;
          }
          const successCallback = () => this.setState({ content: '' });
          this.props.onSubmit(
            this.state.content,
            this.props.replyToId || null,
            successCallback,
            this.user().uid
          );
        }}
      >
        {this.props.multiline ? (
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={this.props.placeholder || 'How are you?'}
            value={this.state.content}
            onChange={this.handleChange}
          />
        ) : (
          <Form.Control
            type="text"
            placeholder={this.props.placeholder || 'How are you?'}
            value={this.state.content}
            onChange={this.handleChange}
            size={this.props.small ? 'sm' : null}
          />
        )}
        {!this.props.hideSubmitButton && (
          <Button
            className="mt-1"
            variant="primary"
            type="submit"
            // disabled={this.state.content === ''}
          >
            Post
          </Button>
        )}
      </Form>
    );
  }
}
