import React, { Component } from 'react';
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
      this.setState({
        user,
      });
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
    const user = userRef.update({ holes: this.state.holes });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user }, () => {
          const uid = this.state.user && this.state.user.uid;
          const userRef = firebase.database().ref('users/' + uid);
          userRef.on('value', (snapshot) => {
            let user = snapshot.val();
            // console.log(user);
            this.setState({
              holes: user && user.holes,
            });
          });
        });
      }
    });
  }
  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Game</h1>
            {this.state.user ? (
              <button onClick={this.logout}>Log Out</button>
            ) : (
              <button onClick={this.login}>Log In</button>
            )}
          </div>
        </header>
        {this.state.user ? (
          <div>
            <div className="user-profile">
              <img src={this.state.user.photoURL} />
            </div>
            {this.state.holes === null || <div>Holes: {this.state.holes}</div>}
            {this.state.holes === null || (
              <button onClick={this.digHole}>Dig</button>
            )}
            <form onSubmit={this.handleSubmitSave}>
              <button>Save</button>
            </form>
          </div>
        ) : (
          <div className="wrapper">
            <p>You must be logged in to play this game.</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
