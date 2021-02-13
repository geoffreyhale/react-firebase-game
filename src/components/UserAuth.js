import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import MyDropdownToggle from './shared/MyDropdownToggle';
import { UserPhoto } from './shared/User';
import { AppContext } from './AppProvider';

const AccountDropdownMenu = ({ logout }) => {
  const { user } = useContext(AppContext);
  if (!user) {
    return null;
  }
  return (
    <Dropdown className="float-right">
      <MyDropdownToggle />
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/settings">
          Settings
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item as="button" onClick={logout}>
          Log Out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const LogInButton = ({ children, login, style }) => (
  <Button variant="primary" onClick={login} style={style}>
    {children || 'Log In'}
  </Button>
);

const UserAuth = ({ login, logout }) => {
  const { user } = useContext(AppContext);
  if (!user) {
    return <LogInButton login={login} />;
  }
  return (
    <>
      <UserPhoto uid={user.uid} />
      <AccountDropdownMenu logout={logout} />
    </>
  );
};

export default UserAuth;
