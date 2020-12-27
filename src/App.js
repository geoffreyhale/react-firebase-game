import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { Link, NavLink, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase, { auth, provider } from './firebase.js';
import UserAuth from './components/UserAuth';
import Game from './components/Game';

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
        <Container>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <NavLink to="/game">Game</NavLink>
            </li>
            <li>
              <NavLink to="/groups">Groups</NavLink>
            </li>
          </ul>
          <header>
            <Card>
              <Card.Body>
                <h1 style={{ display: 'inline-block' }}>Game</h1>
                <div style={{ float: 'right' }}>
                  <UserAuth
                    user={this.state.user}
                    login={this.login}
                    logout={this.logout}
                  />
                </div>
              </Card.Body>
            </Card>
          </header>
          {this.state.user ? (
            <Switch>
              <Route path="/game">
                <Game />
              </Route>
            </Switch>
          ) : (
            <Card>
              <Card.Body>
                <p>You must be logged in to play this game.</p>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    );
  }
}

export default App;
