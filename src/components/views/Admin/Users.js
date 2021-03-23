import React from 'react';
import Table from 'react-bootstrap/Table';
import FriendlyTimestamp from '../../shared/timestamp';
import { User } from '../../shared/User';

export const Users = ({ usersArray, posts }) => {
  //TODO most of these are duplicated from Funnel
  const countTotal = usersArray.length;
  const countPremium = usersArray.filter((user) => user.isPremium).length;
  const premiumPercentage = Math.round((countPremium / countTotal) * 100);
  const countUsedModality =
    posts &&
    typeof posts === 'object' &&
    Object.values(posts)
      .filter((post) => !post.deleted && post.modalities)
      .map((post) => post.userId)
      .filter((uid, i, self) => self.indexOf(uid) === i).length;
  const usedModalityPercentage = Math.round(
    (countUsedModality / countTotal) * 100
  );
  const hasUsername = usersArray.filter((user) => user.username).length;
  const hasUsernamePercentage = Math.round((hasUsername / countTotal) * 100);
  const noUsername = usersArray.filter((user) => !user.username).length;
  const hasNoUsernamePercentage = Math.round((noUsername / countTotal) * 100);
  return (
    <>
      <div>
        <strong>Registered:</strong> {countTotal}
      </div>
      <div>
        <strong>Premium:</strong> {countPremium} ({premiumPercentage}%)
      </div>
      <div>
        <strong>Used Modality:</strong> {countUsedModality} (
        {usedModalityPercentage}%)
      </div>
      <br />
      <div>
        <strong>Username:</strong> {hasUsername} ({hasUsernamePercentage}%)
      </div>
      <div>
        <strong>No Username:</strong> {noUsername} ({hasNoUsernamePercentage}%)
      </div>
    </>
  );
};

export const UsersTable = ({ setSort, usersArray }) => (
  <Table bordered hover size="sm">
    <thead>
      <tr>
        <td onClick={() => setSort('uid')}>uid</td>
        <td onClick={() => setSort('displayName')}>displayName</td>
        <td onClick={() => setSort('email')}>email</td>
        <td onClick={() => setSort('lastOnline')}>lastOnline</td>
        <td onClick={() => setSort('lastLogin')}>lastLogin</td>
        <td onClick={() => setSort('joined')}>joined</td>
      </tr>
    </thead>
    <tbody>
      {usersArray.map((user) => {
        return (
          <tr key={user.uid}>
            <td>{user.uid}</td>
            <td>
              <User uid={user.uid} displayName={user.displayName} />
            </td>
            <td>{user.email}</td>
            <td>{FriendlyTimestamp(user.lastOnline)}</td>
            <td>{FriendlyTimestamp(user.lastLogin)}</td>
            <td>{FriendlyTimestamp(user.joined)}</td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);
