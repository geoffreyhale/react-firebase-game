import React from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Posts from '../Posts';

export const ROOMS = Object.freeze({
  dev: {
    color: 'Beige',
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
    available: true,
    url: '/r/general',
    color: 'AliceBlue',
    description: (
      <small className="text-muted">
        <ul>
          <li>This is a public room for discussing anything.</li>
        </ul>
      </small>
    ),
    doesNotRequirePremium: true,
  },
  healthyrelating: {
    available: true,
    url: '/r/healthyrelating',
    color: 'MistyRose',
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
  },
  home: {
    doesNotRequirePremium: true,
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

    return (
      <Posts
        roomId={roomId}
        roomColor={room.color}
        roomDescription={room.description}
        roomRequiresPremium={!room.doesNotRequirePremium}
      />
    );
  }
}

export default withRouter(Rooms);
