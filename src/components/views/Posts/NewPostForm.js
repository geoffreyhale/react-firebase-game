import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { AppContext } from '../../AppProvider';
import countWords from '../../shared/countWords';
import { MODALITIES, WriteDescription } from './Modality';

const SelectModality = ({ setModality, modality }) => {
  // const [modality, setModality] = useState(null);
  return (
    <>
      <DropdownButton
        id="dropdown-basic-button"
        title={modality ? MODALITIES[modality].title : 'Select Modality'}
        variant={modality ? 'warning' : 'outline-warning'}
      >
        {Object.entries(MODALITIES).map(([key, MODALITY]) => (
          <Dropdown.Item
            as="div" //button would trigger onSubmi
            onClick={() => setModality(modality === key ? null : key)}
          >
            {MODALITY.title}
          </Dropdown.Item>
        ))}
        <Dropdown.Item disabled>Coming soon...</Dropdown.Item>
      </DropdownButton>
      {MODALITIES[modality] && (
        <Card border="warning">
          <Card.Body>
            {MODALITIES[modality].description}
            {WriteDescription}
          </Card.Body>
        </Card>
      )}
    </>
  );
};

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
      modality: null,
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
          console.log('in onSubmit');
          console.log(this.props);
          console.log(this.state);
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
            this.props.onSubmit({
              content: this.state.content,
              replyToId: this.props.replyToId || null,
              successCallback,
              uid: this.user().uid,
              room: this.props.hackRoom,
              modality: this.state.modality,
            });
          }
        }}
      >
        {this.props.multiline &&
          this.props.hackRoom === 'healthyrelating' &&
          !this.props.replyToId && (
            <SelectModality
              setModality={(modality) => {
                this.setState({ modality });
              }}
              modality={this.state.modality}
            />
          )}
        <div className="mt-1">
          {this.props.multiline ? (
            <Form.Control
              as="textarea"
              rows={4}
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
        </div>
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
