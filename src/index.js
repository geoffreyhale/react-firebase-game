import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, NavLink, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
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
      <Switch>
        <Route path="/game">
          <App />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
