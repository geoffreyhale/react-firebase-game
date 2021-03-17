import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { yearMonthDay } from '../../shared/friendlyTimestamp';
import { AppContext } from '../../AppProvider';
import Spinner from '../../shared/Spinner';
import { User } from '../../shared/User';

const AccountingLink = ({ id }) => (
  <a
    href={`https://console.firebase.google.com/u/0/project/react-firebase-2020-aecbd/firestore/data~2Faccounting~2F${id}`}
    target="_blank"
    rel="noreferrer"
  >
    {id}
  </a>
);

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
        <Card.Title>Transactions</Card.Title>
        <Table>
          <thead>
            <tr>
              <th>id</th>
              <th>timestamp</th>
              <th>description</th>
              <th>usd</th>
              <th>user</th>
              <th>via</th>
              <th>notes</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(accounting)
              .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds)
              .map((a) => (
                <tr key={a.id}>
                  <td>
                    <AccountingLink id={a.id} />
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {yearMonthDay(a.timestamp?.seconds * 1000)}
                  </td>
                  <td>{a.description}</td>
                  <td>${a.usd}</td>
                  <td>
                    <User uid={a.uid} displayName={users[a.uid]?.displayName} />
                  </td>
                  <td>{a.via}</td>
                  <td>{a.notes}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>${totalUsd({ accounting })}</td>
              <td></td>
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
