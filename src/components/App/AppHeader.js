import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import AppNav from './AppNav';
import logoImg from './logo192.png';
import Notifications from './Notifications';
import { AppContext } from '../AppProvider';
import { UserPhoto } from '../shared/User';
import MyDropdownToggle from '../shared/MyDropdownToggle';

const AccountDropdownMenu = ({ logout }) => {
  const { user } = useContext(AppContext);
  if (!user) {
    return null;
  }
  return (
    <Dropdown>
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

const TopRightMenuItem = ({ children }) => (
  <div className="ml-3" style={{ display: 'inline-block' }}>
    {children}
  </div>
);
export const TopRightMenu = ({ login, logout }) => {
  const { user } = useContext(AppContext);
  if (user) {
    return (
      <div className="float-right">
        <TopRightMenuItem>
          <UserPhoto uid={user.uid} />
        </TopRightMenuItem>
        <TopRightMenuItem>
          <Notifications />
        </TopRightMenuItem>
        <TopRightMenuItem>
          <AccountDropdownMenu logout={logout} />
        </TopRightMenuItem>
      </div>
    );
  }
  return (
    <div className="float-right">
      <TopRightMenuItem>
        <LogInButton login={login} />
      </TopRightMenuItem>
    </div>
  );
};

const AppHeaderTitle = () => {
  // const taglines = [
  //   <em>better together &#128149;</em>,
  //   <em>healthy relating &#128149;</em>,
  // ];
  // const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

  return (
    <h1 style={{ display: 'inline-block', marginBottom: 0 }}>
      <Link
        to="/"
        style={{
          color: 'inherit',
          textDecoration: 'inherit',
        }}
      >
        <span title="xBook">
          <img
            src={logoImg}
            alt="xBook logo"
            style={{ verticalAlign: 'bottom', height: '3rem' }}
          />
          <span className="ml-2">xBook</span>
        </span>
      </Link>
      <span className="text-muted ml-2 d-none d-sm-inline">
        <small style={{ fontSize: '50%', fontWeight: 300 }}>
          healthy community
        </small>
      </span>
    </h1>
  );
};

const AppHeader = ({ login, logout }) => {
  const { user } = useContext(AppContext);

  return (
    <header>
      <Card>
        <Card.Body>
          <AppHeaderTitle />
          <TopRightMenu login={login} logout={logout} />
        </Card.Body>
      </Card>
      {user && (
        <Card className="mt-1">
          <Card.Body
            style={{
              paddingBottom: '0.25rem',
              paddingTop: '0.25rem',
            }}
          >
            <AppNav />
          </Card.Body>
        </Card>
      )}
    </header>
  );
};

export default AppHeader;
