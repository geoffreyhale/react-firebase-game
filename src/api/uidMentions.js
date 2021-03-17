//TODO tests for this regex
const uidMentions = (postContent) =>
  postContent
    .match(/@[0-9a-zA-Z]{28}(?![0-9a-zA-Z])/g)
    ?.map((uid) => uid.substring(1)) || null;
export default uidMentions;
