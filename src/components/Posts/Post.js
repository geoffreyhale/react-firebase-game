import React from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';

//TODO write tests for this function
const friendlyTimestamp = (timestamp) => {
  const timestampDate = new Date(timestamp);
  const formattedTimestamp = format(timestampDate, "MMMM d, yyyy 'at' hh:mm b");
  const duration = intervalToDuration({
    start: timestampDate,
    end: new Date(),
  });
  if (duration.years || duration.months || duration.days > 3) {
    return `${formattedTimestamp}`;
  }
  if (duration.days) {
    return `${duration.days}d`;
  }
  if (duration.hours) {
    return `${duration.hours}h`;
  }
  if (duration.minutes) {
    return `${duration.minutes}m`;
  }
  if (duration.seconds) {
    return `${duration.seconds}s`;
  }
  return `${formattedTimestamp} (${formatDuration(duration)})`;
};

export const PostHeader = ({
  displayName,
  showActions,
  postActionsDropdown,
  timestamp,
  photoURL,
  small,
  postId,
}) => (
  <div style={{ fontSize: small ? '85%' : null }}>
    <div className="float-left mr-2">
      {photoURL ? (
        <img src={photoURL} alt="user" style={{ height: small ? 38 : 48 }} />
      ) : null}
    </div>
    <>
      <div>
        <strong>{displayName}</strong>
        <div className="float-right">
          {showActions ? postActionsDropdown : null}
        </div>
      </div>
      <div className="small text-muted">
        <Link to={'post/' + postId}>{friendlyTimestamp(timestamp)}</Link>
      </div>
    </>
    <div style={{ clear: 'both' }}></div>
  </div>
);
