import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase, { auth, provider } from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      holes: null,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.digHole = this.digHole.bind(this);
    this.handleSubmitSave = this.handleSubmitSave.bind(this);
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
  digHole() {
    this.setState({
      holes: this.state.holes + 1,
    });
  }
  handleSubmitSave(e) {
    e.preventDefault();
    const uid = this.state.user && this.state.user.uid;
    const userRef = firebase.database().ref('users/' + uid);
    userRef.update({ holes: this.state.holes });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user }, () => {
          const uid = this.state.user && this.state.user.uid;
          const userRef = firebase.database().ref('users/' + uid);
          userRef.on('value', (snapshot) => {
            let user = snapshot.val();
            this.setState({
              holes: (user && user.holes) || 0,
            });
          });
        });
      }
    });
  }
  render() {
    return (
      <div className="app">
        <Container>
          <header>
            <div className="wrapper">
              <h1>Game</h1>
              {this.state.user ? (
                <Button variant="danger" onClick={this.logout}>
                  Log Out
                </Button>
              ) : (
                <Button variant="primary" onClick={this.login}>
                  Log In
                </Button>
              )}
            </div>
          </header>
          {this.state.user ? (
            <div>
              <div className="user-profile">
                <img src={this.state.user.photoURL} alt="user photo" />
              </div>
              {this.state.holes === null || (
                <div>Holes: {this.state.holes}</div>
              )}
              {this.state.holes === null || (
                <Button variant="primary" onClick={this.digHole}>
                  Dig
                </Button>
              )}
              <form onSubmit={this.handleSubmitSave}>
                <Button variant="success" type="submit">
                  Save
                </Button>
              </form>
            </div>
          ) : (
            <div className="wrapper">
              <p>You must be logged in to play this game.</p>
            </div>
          )}
        </Container>
      </div>
    );
  }
}

export default App;
