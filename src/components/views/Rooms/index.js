import React from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Posts from '../Posts';

export const ROOMS = Object.freeze({
  dev: {
    id: 'dev',
    url: '/r/dev',
    color: 'Beige',
    title: '/r/dev',
    description: (
      <small className="text-muted">
        <ul>
          <li>
            This is a public room for discussing bugs, feature requests,
            technical support, developer updates, new features, and other
            release notes.
          </li>
        </ul>
      </small>
    ),
  },
  general: {
    id: 'general',
    available: true,
    url: '/r/general',
    color: 'AliceBlue',
    title: '/r/general',
    description: (
      <small className="text-muted">
        <ul>
          <li>This is a public room for discussing anything.</li>
        </ul>
      </small>
    ),
  },
  healthyrelating: {
    id: 'healthyrelating',
    available: true,
    url: '/r/healthyrelating',
    color: 'MistyRose',
    title: '/r/healthyrelating',
    description: (
      <small className="text-muted">
        <ul>
          <li>This is a premium room. &#11088;</li>
          <li>This room is for discussing and practicing healthy relating.</li>
          <li>
            This room is also for discussing xbk.io features to support healthy
            relating.
          </li>
        </ul>
      </small>
    ),
    requiresPremium: true,
  },
  home: {
    id: 'home',
    url: '/',
    title: 'Home',
  },
});

const RoomDoesNotExist = () => (
  <Card>
    <Card.Body>
      <Card.Title>Room Does Not Exist</Card.Title>
      <p>Want this room to exist? Ask for it in r/general.</p>
    </Card.Body>
  </Card>
);

class Rooms extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  // TODO maybe more robust to use a room context instead of prop-drilling this room stuff
  render() {
    const { roomId = 'home' } = this.props.match.params;

    const room = ROOMS[roomId];

    if (!room) {
      return <RoomDoesNotExist />;
    }

    return <Posts room={room} />;
  }
}

export default withRouter(Rooms);
