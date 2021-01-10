import React from 'react';
import NewPostForm from './NewPostForm';
import Tag from './Tag';

const PostTags = ({ tags, myUserId, addTag, postId }) => {
  return (
    <div>
      {tags &&
        Object.values(tags).map((tag) => {
          const tagUniqueKey = postId + tag.userId + tag.type + Math.random();
          if (tag.userId === myUserId) {
            return (
              <Tag variant="info" key={tagUniqueKey}>
                {tag.type}
              </Tag>
            );
          }
          return <Tag key={tagUniqueKey}>{tag.type}</Tag>;
        })}
      <div className={'mt-1'}>
        <NewPostForm
          onSubmit={(content, replyToId, successCallback) => {
            addTag(content, successCallback);
          }}
          placeholder="tag"
          hideSubmitButton={true}
          small={true}
        />
      </div>
    </div>
  );
};

export default PostTags;
