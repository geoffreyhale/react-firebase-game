import React, { useContext, useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { postsRef } from '../../../api';
import { AppContext } from '../../AppProvider';
import Post from '../Posts/Post';

//TODO tests

const QueueBadge = ({ children }) => (
  <Badge
    className="mr-2"
    style={{ border: '1px solid lightgrey', padding: '1rem' }}
  >
    {children}
  </Badge>
);

const QueueItem = ({ item }) => {
  const { data, post } = item;
  return (
    <Card className="my-3">
      <Card.Body>
        {data && data.map((datum) => <QueueBadge>{datum}</QueueBadge>)}
        {post && (
          <Post
            post={post}
            hackHideRepliesCount={true}
            showHeaderLinkToParent={true}
            hackRoom={post.room}
          />
        )}
      </Card.Body>
    </Card>
  );
};

const DATA = Object.freeze({
  NOT_MY_POST: 'not my post',
  NO_REPLIES: 'no replies',
  NO_TAGS: 'no tags',
  NO_UPVOTES: 'no upvotes (besides maybe themselves)',
  I_HAVE_NOT_REPLIED: 'i have not replied',
  NO_ONE_VOTED_ON_MODALITY:
    'is modality post no one has voted on (besides maybe themselves)',
  I_HAVE_NOT_VOTED_ON_MODALITY: 'is modality post i have not voted on',
  MODALITY_WITH_VOTES: 'is modality post with votes (not counting themselves)',
});

const QueusTabTitle = ({ children, queue }) => (
  <>
    {children}{' '}
    <Badge className="ml-1" variant="secondary">
      {queue.length}
    </Badge>
  </>
);
const QueuesTabDescription = ({ children }) => (
  <Card>
    <Card.Body>
      <span className="text-muted">{children}</span>
    </Card.Body>
  </Card>
);
const QueuesItems = ({ queue }) =>
  queue.map((item) => <QueueItem key={Math.random()} item={item} />);

const QueuesTabs = ({ queue }) => {
  const modalityQueue = queue.filter((item) =>
    item.data.includes(DATA.I_HAVE_NOT_VOTED_ON_MODALITY)
  );
  const untouchedQueue = queue.filter(
    (item) =>
      item.data.includes(DATA.NOT_MY_POST) &&
      item.data.includes(DATA.NO_REPLIES) &&
      !item.data.includes(DATA.MODALITY_WITH_VOTES) &&
      item.data.includes(DATA.NO_TAGS) &&
      item.data.includes(DATA.NO_UPVOTES)
  );
  const unrepliedQueue = queue.filter(
    (item) =>
      item.data.includes(DATA.NOT_MY_POST) &&
      item.data.includes(DATA.NO_REPLIES)
  );

  return (
    <Tabs defaultActiveKey="modality" className="my-3">
      <Tab
        eventKey="modality"
        title={<QueusTabTitle queue={modalityQueue}>Modality</QueusTabTitle>}
      >
        <QueuesTabDescription>
          Please vote on these modality posts:
        </QueuesTabDescription>
        <QueuesItems queue={modalityQueue} />
      </Tab>
      <Tab
        eventKey="untouched"
        title={<QueusTabTitle queue={untouchedQueue}>Untouched</QueusTabTitle>}
      >
        <QueuesTabDescription>
          Please touch these posts (reply, tag, or vote):
        </QueuesTabDescription>
        <QueuesItems queue={untouchedQueue} />
      </Tab>
      <Tab
        eventKey="unreplied"
        title={<QueusTabTitle queue={unrepliedQueue}>Unreplied</QueusTabTitle>}
      >
        <QueuesTabDescription>
          Please reply to these posts:
        </QueuesTabDescription>
        <QueuesItems queue={unrepliedQueue} />
      </Tab>
    </Tabs>
  );
};

const Queues = () => {
  const [queue, setQueue] = useState([]);
  const { user, users } = useContext(AppContext);

  useEffect(() => {
    postsRef().on('value', (snapshot) => {
      const apiPosts = snapshot.val();
      const posts = Object.entries(apiPosts).map(([id, post]) => {
        post.id = id;
        //TODO should not have to do this here (for Post view)
        post.userDisplayName = users[post.userId].displayName;
        return post;
      });

      const queue = posts.reverse().map((post) => ({
        data: [],
        post,
      }));
      //TODO tests for these
      //TODO combine conditional checks where possible for efficiency
      queue.forEach((item, i) => {
        const { post } = item;

        if (post.userId !== user.uid) {
          queue[i].data.push(DATA.NOT_MY_POST);
        }
        if (
          post.modality &&
          (!post.modality.votes ||
            (Object.keys(post.modality.votes).length === 1 &&
              Object.keys(post.modality.votes)[0] === post.userId))
        ) {
          queue[i].data.push(DATA.NO_ONE_VOTED_ON_MODALITY);
        }
        if (
          post.modality &&
          post.modality.votes &&
          !(
            Object.keys(post.modality.votes).length === 1 &&
            Object.keys(post.modality.votes)[0] === post.userId
          )
        ) {
          queue[i].data.push(DATA.MODALITY_WITH_VOTES);
        }
        if (
          post.modality &&
          post.modality.votes &&
          !Object.keys(post.modality.votes).includes(user.uid)
        ) {
          queue[i].data.push(DATA.I_HAVE_NOT_VOTED_ON_MODALITY);
        }
        if (
          !Object.values(posts)
            .map((userPost) => userPost.replyToId)
            .includes(post.id)
        ) {
          queue[i].data.push(DATA.NO_REPLIES);
        }
        if (!post.tags) {
          queue[i].data.push(DATA.NO_TAGS);
        }
        if (
          !post.upvote ||
          (Object.keys(post.upvote).length === 1 &&
            Object.keys(post.upvote)[0] === post.userId)
        ) {
          queue[i].data.push(DATA.NO_UPVOTES);
        }
        if (
          !Object.values(posts)
            .filter((post) => post.userId === user.uid)
            .map((userPost) => userPost.replyToId)
            .includes(post.id)
        ) {
          queue[i].data.push(DATA.I_HAVE_NOT_REPLIED);
        }
      });
      setQueue(queue);
    });
  }, []);

  return <QueuesTabs queue={queue} />;
};
export default Queues;
