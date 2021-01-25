import React from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Posts from '../Posts';

const rooms = {
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
    color: 'AliceBlue',
    description: (
      <small className="text-muted">
        <ul>
          <li>This is a public room for discussing anything.</li>
        </ul>
      </small>
    ),
  },
  healthyrelating: {
    color: 'MistyRose',
    description: (
      <small className="text-muted">
        <ul>
          <li>
            This is a public room for discussing and practicing healthy
            relating.
          </li>
          <li>
            This room is also for discussing xbk.io features to support healthy
            relating.
          </li>
        </ul>
      </small>
    ),
  },
};

export const RoomsMenu = () => (
  <Card>
    <Card.Body>
      <Card.Title>Rooms</Card.Title>
      <ul id="rooms">
        <li>
          <Link to={'/r/dev'}>r/dev</Link>
        </li>
        <li>
          <Link to={'/r/general'}>r/general</Link>
        </li>
        <li>
          <Link to={'/r/healthyrelating'}>r/healthyrelating</Link>
        </li>
      </ul>
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
    const { roomId } = this.props.match.params;
    const room = roomId === undefined ? null : rooms[roomId];

    return (
      <Posts
        room={roomId}
        roomColor={room && room.color}
        roomDescription={room && room.description}
      />
    );
  }
}

export default withRouter(Rooms);