import { Link } from 'react-router-dom';
import { getRooms } from '../../../api';

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

const getROOMS = (callback) => {
  getRooms((apiRooms) => {
    const rooms = {};

    Object.keys(apiRooms).forEach((roomKey) => {
      if (ROOMS[roomKey]) {
        rooms[roomKey] = ROOMS[roomKey];
      }
    });

    callback(rooms);
  });
};
export default getROOMS;
