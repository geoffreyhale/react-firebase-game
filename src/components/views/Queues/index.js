import React, { useContext, useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { postsRef } from '../../../api';
import { AppContext } from '../../AppProvider';
import Post from '../Posts/Post';
import { PremiumFeature } from '../../shared/Premium';
import Spinner from '../../shared/Spinner';

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
        {data &&
          data.map((datum) => <QueueBadge key={datum}>{datum}</QueueBadge>)}
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

const QueusTabTitle = ({ children, queue, loading }) => (
  <>
    {children}{' '}
    <Badge className="ml-1" variant="secondary">
      {loading ? <Spinner size="sm" /> : queue.length}
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

const QueuesTabs = ({ queue, loading }) => {
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
        title={
          <QueusTabTitle queue={modalityQueue} loading={loading}>
            Modality
          </QueusTabTitle>
        }
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <QueuesTabDescription>
              Please vote on these modality posts:
            </QueuesTabDescription>
            <QueuesItems queue={modalityQueue} />
          </>
        )}
      </Tab>
      <Tab
        eventKey="untouched"
        title={
          <QueusTabTitle queue={untouchedQueue} loading={loading}>
            Untouched
          </QueusTabTitle>
        }
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <QueuesTabDescription>
              Please touch these posts (reply, tag, or vote):
            </QueuesTabDescription>
            <QueuesItems queue={untouchedQueue} />
          </>
        )}
      </Tab>
      <Tab
        eventKey="unreplied"
        title={
          <QueusTabTitle queue={unrepliedQueue} loading={loading}>
            Unreplied
          </QueusTabTitle>
        }
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <QueuesTabDescription>
              Please reply to these posts:
            </QueuesTabDescription>
            <QueuesItems queue={unrepliedQueue} />
          </>
        )}
      </Tab>
    </Tabs>
  );
};

const modalityHasVotes = ({ modality }) => modality.votes;
const modalityHasVotesNotUid = ({ modality, uid }) =>
  modalityHasVotes({ modality }) &&
  !Object.keys(modality.votes).every((voteKey) => voteKey === uid);
const modalityVotesIncludesUid = ({ modality, uid }) =>
  modalityHasVotes({ modality }) && Object.keys(modality.votes).includes(uid);

const Queues = () => {
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState([]);
  const { user, users } = useContext(AppContext);

  useEffect(() => {
    if (!user.isPremium) return;

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
          post.modalities &&
          !Object.values(post.modalities).some((modality) =>
            modalityHasVotesNotUid({ modality, uid: post.userId })
          )
        ) {
          queue[i].data.push(DATA.NO_ONE_VOTED_ON_MODALITY);
        }
        if (
          post.modalities &&
          Object.values(post.modalities).some((modality) =>
            modalityHasVotesNotUid({ modality, uid: post.userId })
          )
        ) {
          queue[i].data.push(DATA.MODALITY_WITH_VOTES);
        }
        if (
          post.modalities &&
          !Object.values(post.modalities).every((modality) =>
            modalityVotesIncludesUid({ modality, uid: user.uid })
          )
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
      setLoading(false);
    });
  }, []);

  if (!user.isPremium) {
    return <PremiumFeature featureName={'Queues'} />;
  }
  return <QueuesTabs queue={queue} loading={loading} />;
};
export default Queues;
