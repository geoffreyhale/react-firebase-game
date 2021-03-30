import React from 'react';
import Post from '../views/Posts/Post';

const PostsFeed = ({
  posts = {},
  isUnseenFeed = false,
  showHeaderLinkToParent = false,
  hackHideRepliesCount,
}) =>
  Object.values(posts).map((post) => {
    return (
      <div className="mb-4" key={post.id}>
        <Post
          post={post}
          hackRoom={post.room}
          isUnseenFeed={isUnseenFeed}
          showHeaderLinkToParent={showHeaderLinkToParent}
          hackHideRepliesCount={hackHideRepliesCount}
        />
      </div>
    );
  });

export default PostsFeed;
