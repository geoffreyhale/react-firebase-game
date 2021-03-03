import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { createInviteCode, getInviteCodes } from '../../../api';
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
    <>
      <Table>
        <thead>
          <tr>
            <th>Link</th>
            {/* <th>Invite Code</th> */}
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(inviteCodes).map((inviteCode) => (
            <tr>
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
    </>
  );
};
export default InviteCodes;
