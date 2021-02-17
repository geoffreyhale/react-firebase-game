import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { AppContext } from '../../AppProvider';
import countWords from '../../shared/countWords';
import { SelectModality } from './Modality';
import EmotionalAwareness from './Modality/EmotionalAwareness';

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
  modality = () => this.context.modality;
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
    const isPostForm = this.props.multiline;
    const isTagForm = !this.props.multiline;
    return (
      <>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (this.state.content === '') {
              return;
            }
            const successCallback = () => {
              this.setState({ content: '' });
              this.props.onSuccess && this.props.onSuccess();
              this.context.setModality(null);
            };
            if (
              !this.props.onSubmit &&
              this.props.onSubmitEditHack &&
              this.props.editPostIdHack
            ) {
              this.props.onSubmitEditHack({
                id: this.props.editPostIdHack,
                content: this.state.content,
                successCallback,
              });
            } else {
              this.props.onSubmit({
                content: this.state.content,
                replyToId: this.props.replyToId || null,
                successCallback,
                uid: this.user().uid,
                room: this.props.hackRoom,
                modality: this.modality(),
              });
            }
          }}
        >
          {isPostForm && !this.props.replyToId && (
            <div className="mb-2">
              <SelectModality room={this.props.hackRoom} />
              {this.modality() === 'emotionalawareness' && (
                <Card className="mt-2">
                  <Card.Body>
                    <EmotionalAwareness content={this.state.content} />
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
          <div className="mt-1">
            {isPostForm && (
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={this.props.placeholder}
                value={this.state.content}
                onChange={this.handleChange}
                autoFocus={true}
              />
            )}
            {isTagForm && (
              <Form.Control
                type="text"
                placeholder={this.props.placeholder}
                value={this.state.content}
                onChange={this.handleChange}
                size={this.props.small ? 'sm' : null}
                autoFocus={true}
              />
            )}
          </div>
          {isPostForm && (
            <span className="float-right text-muted">
              <WordCount words={this.state.content} />
            </span>
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
      </>
    );
  }
}
