import { Link } from 'react-router-dom';
import { getRooms } from '../../../api';

export const room_overrides = Object.freeze({
  home: {
    url: '/',
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
    url: '/r/dev',
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
    url: '/r/general',
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
    requiresPremium: true,
  },
  productivity: {
    url: '/r/productivity',
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

export const premiumRooms = Object.values(room_overrides)
  .filter((room) => room.requiresPremium)
  .map((room) => room.id);

const getROOMS = (callback) => {
  getRooms((apiRooms) => {
    const rooms = {};

    // add from database and override w local
    Object.entries(apiRooms).forEach(([roomKey, room]) => {
      rooms[roomKey] = room_overrides[roomKey]
        ? Object.assign(room, room_overrides[roomKey])
        : room;
    });
    // add local override rooms that don't exist in database
    Object.entries(room_overrides).forEach(([roomKey, room]) => {
      if (!rooms[roomKey]) {
        rooms[roomKey] = room;
      }
    });

    callback(rooms);
  });
};
export default getROOMS;
