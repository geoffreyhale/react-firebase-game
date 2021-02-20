import React from 'react';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router';
import { AppContext } from '../../AppProvider';
import { validModalityForRoom } from '../../shared/Modalities';
import Posts from '../Posts';

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
  rooms = () => this.context.rooms;

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

    const room = this.rooms()[roomId];

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
