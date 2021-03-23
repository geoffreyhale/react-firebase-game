import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormLabel from 'react-bootstrap/FormLabel';
import Table from 'react-bootstrap/Table';
import {
  createInviteCode,
  deleteInviteCode,
  getInviteCodes,
  setInviteCodeNotes,
} from '../../../api';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';
import FriendlyTimestamp from '../../shared/timestamp';
import InvitedBy from './InvitedBy';

const InviteCodeNotes = ({ id, notes }) => {
  const history = useHistory();
  const [newNotes, setNotes] = useState(notes);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading) return <Spinner />;

  return editMode ? (
    <>
      <>
        <FormLabel>Notes</FormLabel>
        <Form.Control
          as="textarea"
          rows={1}
          value={newNotes}
          onChange={(e) => setNotes(e.target.value)}
          autoFocus={true}
        />
      </>
      <br />
      <Button
        onClick={() => {
          setLoading(true);
          setInviteCodeNotes({ id, notes: newNotes }, () => {
            history.go(0);
          });
        }}
        variant="primary"
      >
        save
      </Button>
      <Button
        onClick={() => {
          setEditMode(false);
          setNotes(notes);
        }}
        variant="danger"
      >
        cancel
      </Button>
    </>
  ) : (
    <>
      {newNotes}{' '}
      <Button onClick={() => setEditMode(true)} variant="link">
        edit
      </Button>
    </>
  );
};

const InviteCodes = () => {
  const { user } = useContext(AppContext);
  const history = useHistory();
  const [inviteCodes, setInviteCodes] = useState({});
  const [loading, setLoading] = useState(false);
  const { uid } = user;
  useEffect(() => {
    getInviteCodes({ uid }, (inviteCodes) => setInviteCodes(inviteCodes));
  }, []);

  if (!user) return null;
  if (loading) return <Spinner />;

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Your Invite Codes</Card.Title>
        <Button
          className="mb-3"
          onClick={() => {
            setLoading(true);
            createInviteCode({ uid }, () => {
              history.go(0);
            });
          }}
        >
          Create New Invite Code
        </Button>
        <Table>
          <thead>
            <tr>
              <th>Link</th>
              <th>Created At</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(inviteCodes)
              .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
              .map((inviteCode) => (
                <tr key={inviteCode.id}>
                  <td>
                    <Link to={`/?inviteCode=${inviteCode.id}`}>
                      {window.location.host}/?inviteCode={inviteCode.id}
                    </Link>
                  </td>
                  <td>
                    {inviteCode.createdAt &&
                      FriendlyTimestamp(inviteCode.createdAt.seconds * 1000)}
                  </td>
                  <td>
                    <InviteCodeNotes
                      id={inviteCode.id}
                      notes={inviteCode.notes}
                    />
                  </td>
                  <td>
                    <Button
                      onClick={() => {
                        setLoading(true);
                        deleteInviteCode(
                          { inviteCodeId: inviteCode.id },
                          () => {
                            history.go(0);
                          }
                        );
                      }}
                      variant="link"
                      style={{ color: 'red' }}
                    >
                      delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

const InviteCodesPage = () => (
  <Card>
    <Card.Body>
      <Card.Title>Invite Codes</Card.Title>
      <InviteCodes />
      <InvitedBy />
    </Card.Body>
  </Card>
);
export default InviteCodesPage;
