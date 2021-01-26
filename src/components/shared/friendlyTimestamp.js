import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';

export const elapsedDuration = ({ timestamp }) => {
  return intervalToDuration({
    start: new Date(timestamp),
    end: new Date(),
  });
};

//TODO write tests for this function
const friendlyTimestamp = (timestamp, suffix = '', style = null) => {
  if (!timestamp) {
    return;
  }
  if (typeof timestamp === 'object') {
    console.error('friendlyTimestamp cannot convert object to timestamp');
    return;
  }

  const duration = elapsedDuration({ timestamp });

  let content = false;
  let useSuffix = false;
  if (duration.years || duration.months || duration.days > 3) {
    const formattedTimestamp = format(
      new Date(timestamp),
      "MMMM d, yyyy 'at' hh:mm b"
    );
    content = formattedTimestamp;
    useSuffix = true;
  } else if (duration.days) {
    content = `${duration.days}d`;
    useSuffix = true;
  } else if (duration.hours) {
    content = `${duration.hours}h`;
    useSuffix = true;
  } else if (duration.minutes) {
    content = `${duration.minutes}m`;
    useSuffix = true;
  } else if (duration.seconds) {
    content = `${duration.seconds}s`;
    useSuffix = true;
  } else if (Object.values(duration).every((unit) => unit === 0)) {
    content = 'just now';
  }

  if (content) {
    return (
      <>
        <span style={style}>{content}</span>
        {useSuffix ? suffix : ''}
      </>
    );
  }
};

export default friendlyTimestamp;
