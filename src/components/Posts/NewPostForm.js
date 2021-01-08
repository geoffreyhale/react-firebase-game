import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class NewPostForm extends React.Component {
  constructor() {
    super();
    this.state = {
      content: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ content: event.target.value });
  }
  render() {
    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          const successCallback = () => this.setState({ content: '' });
          this.props.onSubmit(
            this.state.content,
            this.props.replyToId || null,
            successCallback
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
            className="mt-3"
            variant="primary"
            type="submit"
            disabled={this.state.content === ''}
          >
            Post
          </Button>
        )}
      </Form>
    );
  }
}
