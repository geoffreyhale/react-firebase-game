import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import UserAuth from './components/UserAuth';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';

const AppHeaderTitle = () => {
  return (
    <h1 style={{ display: 'inline-block', marginBottom: 0 }}>
      <Link
        to="/"
        style={{
          color: 'inherit',
          textDecoration: 'inherit',
        }}
      >
        <img
          src="logo192.png"
          alt="xbook logo"
          style={{ verticalAlign: 'bottom', height: '3rem' }}
        />
        &#128216;
        <span className="ml-2">X Book</span>
      </Link>
      <span className="text-muted ml-2">
        <small style={{ fontSize: '50%' }}>
          <em>better together &#128149;</em>
        </small>
      </span>
    </h1>
  );
};

const UnderConstruction = () => [
  <span title="Under Construction">(&#128679; under construction)</span>,
];

const AppNav = () => {
  return (
    <Nav className="justify-content-center">
      <Nav.Item>
        <Nav.Link as={'span'}>
          <Link to="/">Home</Link>
        </Nav.Link>
      </Nav.Item>
      <NavDropdown title="Groups">
        <NavDropdown.Item>
          <Nav.Link as={'span'}>
            <NavLink to="/groups">My Unlisted Groups</NavLink>{' '}
            <UnderConstruction />
          </Nav.Link>
        </NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Games">
        <NavDropdown.Item>
          <Nav.Link as={'span'}>
            <NavLink to="/game">Digger</NavLink>
          </Nav.Link>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <Nav.Link as={'span'}>
            <NavLink to="/tictactoe">Tic-tac-toe</NavLink>
          </Nav.Link>
        </NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="&#8943;">
        <NavDropdown.Item>
          <Nav.Link as={'span'}>
            <NavLink to="/scorekeeper">Scorekeeper </NavLink>
          </Nav.Link>
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });
  }
  //TODO move to UserAuth
  login() {
    auth.signInWithPopup(provider).then((result) => {
      const user = result.user;
      this.setState(
        {
          user,
        },
        () => {
          const uid = user.uid;
          const userRef = firebase.database().ref('users/' + uid);
          userRef.update({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
        }
      );
    });
  }
  //TODO move to UserAuth
  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null,
      });
    });
  }
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Container fluid>
            <Row>
              <Col style={{ paddingRight: 0, paddingLeft: 0 }}>
                <header>
                  <Card>
                    <Card.Body>
                      <AppHeaderTitle />
                      <div style={{ float: 'right' }}>
                        <UserAuth
                          user={this.state.user}
                          login={this.login}
                          logout={this.logout}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                  <Card className="mt-1">
                    <Card.Body
                      style={{
                        paddingBottom: '0.25rem',
                        paddingTop: '0.25rem',
                      }}
                    >
                      {this.state.user ? (
                        <>
                          <AppNav />
                        </>
                      ) : (
                        <div>
                          <small className="text-muted">
                            <em>
                              New online community that will never sell your
                              data.
                              <br />
                              Join the discussion now for free.
                            </em>
                          </small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </header>
                <div className="mt-3">
                  <Routes user={this.state.user} />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
