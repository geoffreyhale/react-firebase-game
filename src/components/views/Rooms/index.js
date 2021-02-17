import React from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Posts from '../Posts';
import { AppContext } from '../../AppProvider';
import { validModalityForRoom } from '../Posts/Modality';

export const ROOMS = Object.freeze({
  home: {
    available: true,
    id: 'home',
    url: '/',
    title: 'Home',
    description: (
      <small className="text-muted">
        <ul>
          <li>
            This is view of all of the posts you have access to all in one
            place.
          </li>
          <li>
            Writing a new post from here will post to{' '}
            <Link to={'/r/general'}>r/general</Link> room.
          </li>
        </ul>
      </small>
    ),
  },
  dev: {
    id: 'dev',
    url: '/r/dev',
    color: 'Beige',
    title: 'r/dev',
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
    title: 'r/general',
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
    title: 'r/healthyrelating',
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
  productivity: {
    id: 'productivity',
    available: true,
    url: '/r/productivity',
    title: 'r/productivity',
    description: (
      <small className="text-muted">
        <ul>
          <li>This is a premium room. &#11088;</li>
          <li>
            This room is for discussing productivity hacks, lessons learned, and
            celebrating success.
          </li>
        </ul>
      </small>
    ),
    requiresPremium: true,
  },
});

export const premiumRooms = Object.values(ROOMS)
  .filter((room) => room.requiresPremium)
  .map((room) => room.id);

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
    this.state = { room: null };
  }

  static contextType = AppContext;
  user = () => this.context.user;

  componentDidMount() {
    const { roomId = 'home' } = this.props.match.params;

    if (
      !validModalityForRoom({
        modalityKey: this.context.modality,
        room: roomId === 'home' ? 'general' : roomId,
      })
    ) {
      this.context.setModality(null);
    }

    const room = ROOMS[roomId];

    if (room && room.title) {
      document.title = `${room.title} | xBook`;
    }

    this.setState({ room });
  }

  // TODO maybe more robust to use a room context instead of prop-drilling this room stuff
  render() {
    const { room } = this.state;

    if (!room) {
      return <RoomDoesNotExist />;
    }

    return <Posts room={room} />;
  }
}

export default withRouter(Rooms);
