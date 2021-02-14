import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { AppContext } from '../../AppProvider';
import { updateUsername } from '../../../api';

const Username = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user.username);

  if (editMode) {
    return (
      <>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          className="ml-3"
          variant="primary"
          size="sm"
          onClick={() => {
            updateUsername(
              { uid: user.uid, username } /*, TODO refreshContextUser*/
            );
            setEditMode(false);
          }}
        >
          save
        </Button>
        <Button
          className="ml-3"
          variant="danger"
          size="sm"
          onClick={() => {
            setUsername(user.username);
            setEditMode(false);
          }}
        >
          cancel
        </Button>
      </>
    );
  }
  return (
    <>
      {username}{' '}
      {/* TODO show context value instead of displaying local value */}
      <Button
        className="ml-3"
        variant="link"
        size="sm"
        onClick={() => setEditMode(true)}
      >
        edit
      </Button>
    </>
  );
};

export default class Settings extends React.Component {
  constructor() {
    super();
  }

  static contextType = AppContext;

  render() {
    const { user } = this.context;
    return (
      <Card>
        <Card.Header>Settings</Card.Header>
        <Card.Body>
          <Card.Title>Settings</Card.Title>
          <Table style={{ display: 'inline-block' }}>
            <tbody>
              <tr>
                <td>Display Name</td>
                <td>{user.displayName}</td>
              </tr>
              <tr>
                <td>Username</td>
                <td>
                  <Username user={user} />
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  }
}
