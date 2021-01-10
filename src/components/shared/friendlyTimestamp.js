import format from 'date-fns/format';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';

//TODO write tests for this function
const friendlyTimestamp = (timestamp) => {
  if (!timestamp) {
    return;
  }
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

export default friendlyTimestamp;
