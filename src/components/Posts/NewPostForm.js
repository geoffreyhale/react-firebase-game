import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AppContext } from '../AppProvider';
import countWords from '../shared/countWords';

const WordCount = ({ words }) => {
  const [show, setShow] = useState(false);
  return (
    <span onClick={() => setShow(!show)}>
      {show ? countWords(words) : <>&#x1f9ee;</>}
    </span>
  );
};

// TODO rename cuz this handles editPost now too
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

  componentDidMount() {
    this.props.content && this.setState({ content: this.props.content });
  }

  handleChange(event) {
    const content = event.target.value;
    if (
      this.props.characterLimit &&
      content.length > this.props.characterLimit
    ) {
      return;
    }

    this.setState({
      content: content,
    });
  }

  render() {
    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (this.state.content === '') {
            return;
          }
          const successCallback = () => {
            this.setState({ content: '' });
            this.props.onSuccess && this.props.onSuccess();
          };
          if (
            !this.props.onSubmit &&
            this.props.onSubmitEditHack &&
            this.props.editPostIdHack
          ) {
            this.props.onSubmitEditHack({
              id: this.props.editPostIdHack,
              content: this.state.content,
              successCallback: successCallback,
            });
          } else {
            this.props.onSubmit(
              this.state.content,
              this.props.replyToId || null,
              successCallback,
              this.user().uid,
              this.props.hackRoom
            );
          }
        }}
      >
        {this.props.multiline ? (
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={this.props.placeholder}
            value={this.state.content}
            onChange={this.handleChange}
            autoFocus={true}
          />
        ) : (
          <Form.Control
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.content}
            onChange={this.handleChange}
            size={this.props.small ? 'sm' : null}
            autoFocus={true}
          />
        )}
        <span className="float-right text-muted">
          <WordCount words={this.state.content} />
        </span>
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
