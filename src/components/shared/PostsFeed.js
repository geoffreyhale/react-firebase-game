import React from 'react';
import Post from '../views/Posts/Post';

const PostsFeed = ({
  posts = {},
  isUnseenFeed = false,
  showHeaderLinkToParent = false,
  hackHideRepliesCount,
}) => {
  return Object.values(posts).map((post) => {
    const parentPostAuthorUid = posts.find((p) => p.id === post.replyToId)
      ?.userId;
    return (
      <div className="mb-4" key={post.id}>
        <Post
          post={post}
          hackRoom={post.room}
          isUnseenFeed={isUnseenFeed}
          showHeaderLinkToParent={showHeaderLinkToParent}
          hackHideRepliesCount={hackHideRepliesCount}
          parentPostAuthorUid={parentPostAuthorUid}
        />
      </div>
    );
  });
};

export default PostsFeed;
