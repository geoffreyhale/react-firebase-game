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
import firebase, { auth, db, provider } from './firebase.js';
import UserAuth from './components/UserAuth';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import AppProvider from './components/AppProvider';
import { getUser, updateUser } from './components/shared/db';

const AppHeaderTitle = () => {
  const taglines = [
    <em>better together &#128149;</em>,
    <em>healthy relating &#128149;</em>,
  ];
  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];

  return (
    <h1 style={{ display: 'inline-block', marginBottom: 0 }}>
      <Link
        to="/"
        style={{
          color: 'inherit',
          textDecoration: 'inherit',
        }}
      >
        <span title="X Book">
          <img
            src="logo192.png"
            alt="xbook logo"
            style={{ verticalAlign: 'bottom', height: '3rem' }}
          />
          <span className="ml-2">Book</span>
        </span>
      </Link>
      <span className="text-muted ml-2">
        <small style={{ fontSize: '50%' }}>{randomTagline}</small>
      </span>
    </h1>
  );
};

const AppNav = ({ admin }) => {
  return (
    <Nav className="justify-content-center">
      <Nav.Item>
        <Nav.Link as={NavLink} to="/" exact>
          Home
        </Nav.Link>
      </Nav.Item>
      <NavDropdown title="&#8943;">
        <NavDropdown.Header>Under Construction</NavDropdown.Header>
        <NavDropdown.Item>
          <Nav.Link as={NavLink} to="/chess">
            Chess
          </Nav.Link>
        </NavDropdown.Item>
        <NavDropdown.Item>
          <Nav.Link as={NavLink} to="/groups">
            Groups
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
      </NavDropdown>
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
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const uid = authUser.uid;

        getUser(uid, (dbUser) => {
          const user = {
            uid: uid,
            admin: dbUser.admin,
            displayName: dbUser.displayName,
            email: dbUser.email,
            photoURL: dbUser.photoURL,
          };
          this.setState({ user });
        });

        // onDisconnect is a feature of firebase realtime database
        // this is the only valid use of the realtime database users collection atm
        // all other user data should be handled in firebase cloud firestore
        firebase
          .database()
          .ref('users/' + uid + '/lastOnline')
          .onDisconnect()
          .set(firebase.database.ServerValue.TIMESTAMP);
      }
    });
  }
  //TODO move to UserAuth
  login() {
    auth.signInWithPopup(provider).then((result) => {
      const authUser = result.user;
      const user = {
        uid: authUser.uid,
        displayName: authUser.displayName,
        email: authUser.email,
        photoURL: authUser.photoURL,
      };
      this.setState(
        {
          user: user,
        },
        () => {
          updateUser({
            uid: authUser.uid,
            user: {
              displayName: authUser.displayName,
              email: authUser.email,
              photoURL: authUser.photoURL,
              joined: new Date(parseInt(authUser.metadata.a)),
              lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            },
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
      <AppProvider user={this.state.user}>
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
                            <AppNav admin={this.state.user.admin} />
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
                    <Routes />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </BrowserRouter>
      </AppProvider>
    );
  }
}

export default App;
