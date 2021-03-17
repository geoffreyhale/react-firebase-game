import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Link } from 'react-router-dom';
import AppNav from './AppNav';
import logoImg from './logo192.png';
import Notifications from './Notifications';
import { AppContext } from '../AppProvider';
import { UserPhoto } from '../shared/User';
import MyDropdownToggle from '../shared/MyDropdownToggle';
import Wizard from '../Wizard';
import HowToGetPremium from '../shared/Premium/HowToGetPremium';

const Beta = () => (
  <>
    <OverlayTrigger
      placement="right"
      overlay={
        <Popover>
          <Popover.Title as="h3">βeta</Popover.Title>
          <Popover.Content>
            Hi, friends! This site is new and under construction. It has known
            bugs and lots of great features. Our developer is hard at work. We
            apprecite your patience, feedback, and support in building this
            healthy community together. :)
          </Popover.Content>
        </Popover>
      }
    >
      <div style={{ display: 'inline-block' }}>βeta</div>
    </OverlayTrigger>
  </>
);

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
        <Dropdown.Item as={Link} to="/invitecodes">
          Invite Codes
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item as={Link} to="/donate">
          Donate
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
        {!user.isPremium && (
          <TopRightMenuItem>
            <HowToGetPremium />
          </TopRightMenuItem>
        )}
        <TopRightMenuItem>
          <UserPhoto uid={user.uid} />
        </TopRightMenuItem>
        <TopRightMenuItem>
          <Wizard icon={true} />
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
  return (
    <div style={{ display: 'inline-block' }}>
      <Link
        to="/"
        style={{
          color: 'inherit',
          textDecoration: 'inherit',
        }}
      >
        <span title="xBook" className="h1">
          <img
            src={logoImg}
            alt="xBook logo"
            style={{ verticalAlign: 'bottom', height: '3rem' }}
          />
          <span className="ml-2">xBook</span>
        </span>
      </Link>
      <span className="text-muted ml-2">
        <Beta />
      </span>
      <span className="text-muted ml-2 d-none d-sm-inline">
        <span style={{ fontWeight: 300 }}>healthy community</span>
      </span>
    </div>
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
