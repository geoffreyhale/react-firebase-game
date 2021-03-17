//TODO tests for this regex
const uidMentions = (postContent) =>
  postContent.match(/@[0-9a-zA-Z]{28}(?=\s|$)/g);
export default uidMentions;
