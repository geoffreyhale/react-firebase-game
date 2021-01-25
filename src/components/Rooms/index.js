import React from 'react';
import { withRouter } from 'react-router';
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

class Rooms extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  // TODO maybe more robust to use a room context instead of prop-drilling this room stuff
  render() {
    const { roomId } = this.props.match.params;
    const room = rooms[roomId];

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
