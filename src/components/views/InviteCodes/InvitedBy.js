import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { AppContext } from '../../AppProvider';
import FriendlyTimestamp from '../../shared/timestamp';

const InvitedBy = () => {
  const { user, users } = useContext(AppContext);
  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Users Joined Via Your Invite Codes</Card.Title>
        <div>
          <small className="text-muted">
            (used one of your invite codes to register)
          </small>
        </div>
        <Table className="mt-3">
          <thead>
            <th>Name</th>
            <th>Joined</th>
          </thead>
          <tbody>
            {users &&
              Object.values(users)
                .filter((u) => u.invitedBy === user.uid)
                .sort(
                  (a, b) =>
                    b.joined && a.joined && b.joined.seconds - a.joined.seconds
                )
                .map((user) => (
                  <tr key={user.uid}>
                    <td>{user.displayName}</td>
                    <td>
                      {user.joined &&
                        FriendlyTimestamp(user.joined.seconds * 1000)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
export default InvitedBy;
