const rePositiveLookbehind = /(?<=@)[0-9a-zA-Z]{28}(?![0-9a-zA-Z])/g;
const reCompatible = /@([0-9a-zA-Z]{28})(?![0-9a-zA-Z])/g;
let matcher;
const uidMentions = (postContent) => {
  const uids = [];
  // return postContent.match(rePositiveLookbehind);
  while ((matcher = reCompatible.exec(postContent))) {
    uids.push(matcher[1]);
  }
  return uids;
};
export default uidMentions;
