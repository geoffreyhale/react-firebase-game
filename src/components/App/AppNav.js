import React, { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../AppProvider';
import { ROOMS } from '../views/Rooms';

const AppNav = () => {
  const { user } = useContext(AppContext);
  const { admin, isPremium } = user;
  return (
    <Nav className="justify-content-center">
      <NavDropdown title="Rooms">
        {Object.values(ROOMS)
          .filter((room) => room.available)
          .map((room) => (
            <NavDropdown.Item>
              <Nav.Link as={NavLink} to={room.url} exact={room.url == '/'}>
                {room.title}
              </Nav.Link>
            </NavDropdown.Item>
          ))}
      </NavDropdown>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/training">
          Training
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/community">
          Community
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/about">
          About
        </Nav.Link>
      </Nav.Item>
      {/* <NavDropdown title="&#8943;" disabled={!isPremium}>
        <NavDropdown.Header>Under Construction</NavDropdown.Header>
        <NavDropdown.Item>
          <Nav.Link as={NavLink} to="/chess">
            Chess
          </Nav.Link>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <Nav.Link as={NavLink} to="/incremental-clicker-game">
            Incremental Clicker
          </Nav.Link>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <Nav.Link as={NavLink} to="/scorekeeper">
            Scorekeeper
          </Nav.Link>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <Nav.Link as={NavLink} to="/tictactoe">
            Tic-tac-toe
          </Nav.Link>
        </NavDropdown.Item>
      </NavDropdown> */}
      {admin && (
        <Nav.Item>
          <Nav.Link as={NavLink} to="/admin">
            Admin
          </Nav.Link>
        </Nav.Item>
      )}
    </Nav>
  );
};

export default AppNav;
