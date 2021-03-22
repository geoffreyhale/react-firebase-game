import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';

export const eventTimestamp = (
  startTimestampSeconds,
  endTimestampSeconds = null
) => {
  if (!startTimestampSeconds) return '';
  const start =
    startTimestampSeconds &&
    typeof startTimestampSeconds === 'number' &&
    format(new Date(startTimestampSeconds * 1000), "EEE, MMM d 'AT' h:mm b");
  if (!start) return '';

  if (!endTimestampSeconds) return start;
  const end =
    endTimestampSeconds &&
    typeof endTimestampSeconds === 'number' &&
    format(new Date(endTimestampSeconds * 1000), "EEE, MMM d 'AT' h:mm b");
  if (!end) return start;

  return `${start} - ${end}`;
};

export const yearMonthDay = (timestampMilliseconds) =>
  timestampMilliseconds &&
  typeof timestampMilliseconds === 'number' &&
  format(new Date(timestampMilliseconds), 'yyyy-MM-dd');

export const elapsedDuration = ({ timestamp }) => {
  return intervalToDuration({
    start: new Date(timestamp),
    end: new Date(),
  });
};

export const friendlyTimestamp = (timestamp, suffix = '', style = null) => {
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
    useSuffix = false;
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
  return { content, useSuffix };
};

const FriendlyTimestamp = (timestamp, suffix = '', style = null) => {
  const { content, useSuffix } =
    friendlyTimestamp(timestamp, suffix, style) || {};
  if (content) {
    return (
      <>
        <span style={style}>{content}</span>
        {useSuffix ? suffix : ''}
      </>
    );
  }
};
export default FriendlyTimestamp;
