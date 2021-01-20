import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import MyDropdownToggle from './shared/MyDropdownToggle';
import UserPhoto from './shared/UserPhoto';

const UserAuth = ({ user, login, logout }) => {
  if (user) {
    return (
      <>
        <UserPhoto src={user.photoURL} />
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
  return (
    <Button variant="primary" onClick={login}>
      Log In
    </Button>
  );
};

export default UserAuth;
