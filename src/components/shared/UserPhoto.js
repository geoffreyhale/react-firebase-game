import React from 'react';
import { getUser } from '../shared/db';

const PremiumIcon = ({ size }) => (
  <div
    style={{
      position: 'absolute',
      left: size / 48,
      top: 0,
      fontSize: size / 3,
    }}
    title="premium member supporting xbk.io"
  >
    &#11088; {/* white medium star emoji */}
  </div>
);

const PresenceIcon = ({ size }) => (
  <div
    style={{
      position: 'absolute',
      right: size / 48,
      bottom: 0,
      fontSize: size / 3,
      // color: 'green',
    }}
    title="online"
  >
    {/* &#11044; black large circle */}
    &#128154; {/* green heart emoji */}
  </div>
);

export default class UserPhoto extends React.Component {
  constructor() {
    super();
    this.state = { user: { photoURL: null } };
  }
  componentDidMount() {
    // TODO implement a cache for users, yikes
    getUser(this.props.uid, (user) => this.setState({ user }));
  }
  render() {
    const { size = 48, presence } = this.props;
    const {
      user: { premium, photoURL: src },
    } = this.state;
    return (
      <div
        key={this.props.key}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <img src={src} alt="user" style={{ height: size, width: size }} />
        {premium && <PremiumIcon size={size} />}
        {presence === 'online' && <PresenceIcon size={size} />}
      </div>
    );
  }
}
