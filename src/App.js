import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import UserAuth from './components/UserAuth';
import Routes from './Routes';

const AppHeaderTitle = () => {
  return (
    <h1 style={{ display: 'inline-block' }}>
      <Link
        to="/"
        style={{
          color: 'inherit',
          textDecoration: 'inherit',
        }}
      >
        xbk.io
      </Link>
      <span className="text-muted ml-2">
        <small style={{ fontSize: '50%' }}>
          <em>better together</em>
        </small>
      </span>
    </h1>
  );
};

const AppNav = () => {
  return (
    <Nav>
      <Nav.Item>
        <Nav.Link as={'span'}>
          <Link to="/">Home</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={'span'}>
          <NavLink to="/game">Game</NavLink>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={'span'}>
          <NavLink to="/groups">Groups</NavLink>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={'span'}>
          <NavLink to="/scorekeeper">Scorekeeper</NavLink>
        </Nav.Link>
      </Nav.Item>
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
  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null,
      });
    });
  }
  render() {
    return (
      <div className="app">
        <Container fluid>
          <Row>
            <Col style={{ paddingRight: 0, paddingLeft: 0 }}>
              <header className="mb-4">
                <Card>
                  <Card.Body style={{ paddingBottom: '0.25rem' }}>
                    <div>
                      <AppHeaderTitle />
                      <div style={{ float: 'right' }}>
                        <UserAuth
                          user={this.state.user}
                          login={this.login}
                          logout={this.logout}
                        />
                      </div>
                    </div>
                    {this.state.user ? (
                      <>
                        <AppNav />
                      </>
                    ) : (
                      <div>
                        <small className="text-muted">
                          <em>
                            New online community that will never sell your data.
                            <br />
                            Join the discussion now for free.
                          </em>
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </header>
              <Routes user={this.state.user} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
