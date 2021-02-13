import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import friendlyTimestamp from '../../shared/friendlyTimestamp';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';
import { User } from '../../shared/User';

const totalUsd = ({ accounting }) =>
  Object.values(accounting).reduce((totalUsd, a) => totalUsd + a.usd, 0);

export const AccountingMiniCard = ({ accounting, users }) => {
  if (!accounting || typeof accounting !== 'object') {
    return <Spinner />;
  }
  return (
    <>
      <div>
        <strong>USD:</strong> ${totalUsd({ accounting })}
      </div>
    </>
  );
};

const Accounting = ({ accounting }) => {
  const { users } = useContext(AppContext);

  if (!accounting || typeof accounting !== 'object') {
    return <Spinner />;
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Accounting</Card.Title>
        <Table>
          <thead>
            <tr>
              {/* <th>id</th> */}
              {/* <th>uid</th> */}
              <th>user</th>
              <th>usd</th>
              <th>via</th>
              <th>timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(accounting)
              .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
              .map((a) => (
                <tr key={a.id}>
                  {/* <td>{a.id}</td> */}
                  {/* <td>{a.uid}</td> */}
                  <td>
                    <User uid={a.uid} displayName={users[a.uid]?.displayName} />
                  </td>
                  <td>${a.usd}</td>
                  <td>{a.via}</td>
                  <td>{friendlyTimestamp(a.timestamp?.seconds * 1000)}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              {/* <td></td> */}
              {/* <td></td> */}
              <td></td>
              <td>${totalUsd({ accounting })}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </Card.Body>
    </Card>
  );
};
export default Accounting;
