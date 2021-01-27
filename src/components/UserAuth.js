import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import MyDropdownToggle from './shared/MyDropdownToggle';
import { UserPhoto } from './shared/User';

export const LogInButton = ({ children, login, style }) => (
  <Button variant="primary" onClick={login} style={style}>
    {children || 'Log In'}
  </Button>
);

const UserAuth = ({ user, login, logout }) => {
  if (user) {
    return (
      <>
        <UserPhoto uid={user.uid} />
        <Dropdown className="float-right">
          <MyDropdownToggle />
          <Dropdown.Menu>
            <Dropdown.Item as="button" onClick={logout}>
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    );
  }
  return <LogInButton login={login} />;
};

export default UserAuth;
