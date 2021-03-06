import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import {
  createInviteCode,
  deleteInviteCode,
  getInviteCodes,
} from '../../../api';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';
import friendlyTimestamp from '../../shared/friendlyTimestamp';

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
      <Card.Header>Invite Codes</Card.Header>
      <Card.Body>
        <Table>
          <thead>
            <tr>
              <th>Link</th>
              {/* <th>Invite Code</th> */}
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(inviteCodes).map((inviteCode) => (
              <tr key={inviteCode.id}>
                <td>
                  <Link to={`/?inviteCode=${inviteCode.id}`}>
                    {window.location.host}/?inviteCode={inviteCode.id}
                  </Link>
                </td>
                {/* <td>{inviteCode.id}</td> */}
                <td>
                  {inviteCode.createdAt &&
                    friendlyTimestamp(inviteCode.createdAt.seconds * 1000)}
                </td>
                <td>
                  <Button
                    onClick={() => {
                      setLoading(true);
                      deleteInviteCode({ inviteCodeId: inviteCode.id }, () => {
                        history.go(0);
                      });
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
        <Button
          onClick={() => {
            setLoading(true);
            createInviteCode({ uid }, () => {
              history.go(0);
            });
          }}
        >
          Create New Single-Use Invite Code
        </Button>
      </Card.Body>
    </Card>
  );
};
export default InviteCodes;
