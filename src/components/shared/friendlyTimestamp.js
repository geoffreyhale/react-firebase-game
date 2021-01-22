import format from 'date-fns/format';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';

//TODO write tests for this function
const friendlyTimestamp = (timestamp, suffix = '', style = null) => {
  if (!timestamp) {
    return;
  }
  if (typeof timestamp === 'object') {
    console.error('friendlyTimestamp cannot convert object to timestamp');
    return;
  }
  const timestampDate = new Date(timestamp);
  const formattedTimestamp = format(timestampDate, "MMMM d, yyyy 'at' hh:mm b");
  const duration = intervalToDuration({
    start: timestampDate,
    end: new Date(),
  });

  let content = false;
  let useSuffix = false;
  if (duration.years || duration.months || duration.days > 3) {
    content = `${formattedTimestamp}`;
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
