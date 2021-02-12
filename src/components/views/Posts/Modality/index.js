import React, { useContext } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { AppContext } from '../../../AppProvider';
import { setModalityVote } from '../../../../api';

export const WriteDescription = (
  <>
    <p>
      You have selected a modality that you'd like to learn and practice. Read
      the description below. Write and submit a post. Other users provide
      feedback and vote on your proficiency in the modality. You get real
      practice, real feedback, and earn proficiency points in the modality.
      Proficiency points can be used to determine eligibility for safer, deeper
      relating rooms.
    </p>
  </>
);

const VoteDescription = (
  <>
    <p>
      Ultimately, we want you to <strong>vote</strong> on whether this user's
      post is a successful attempt at this, their selected modality. In this
      way, you get to learn, train, and determine together whether your
      community meets your standards for healthy relating.
    </p>
    <p>
      After voting, don't forget to join the conversation by replying to the
      post. If the user failed to meet your standards for the modality, help
      them; let's get better together!
    </p>
  </>
);

export const MODALITIES = Object.freeze({
  healthyrelating: {
    room: 'healthyrelating',
    title: 'Healthy Relating',
    description: (
      <p>
        Usually, this is where you can read more information about the selected
        healthy relating <strong>modality</strong>. [This is a test; 'Healthy
        Relating' is not really a "modality".]
      </p>
    ),
  },
  ownershiplanguage: {
    room: 'healthyrelating',
    title: 'Ownership Language',
    description: (
      <ul>
        <li>
          <blockquote>
            "language that identifies the source of the information that is
            being shared"
            <ul>
              <li>"I think..."</li>
              <li>"I read this in..."</li>
              <li>"In my opinion..."</li>
              <li>"My experience is…"</li>
              <li>"This was someone else’s experience…"</li>
              <li>"The information I have been taught on this subject is…"</li>
              <li>
                "This is what I’ve been told, but it isn’t necessarily my
                experience…"
              </li>
            </ul>
            <cite>
              —{' '}
              <a
                href="https://www.onecommunityglobal.org/conscious-and-conscientious-communication/"
                target="_blank"
              >
                Conscious and Conscientious Communication
              </a>
            </cite>
          </blockquote>
        </li>
        <li>
          <blockquote>
            <p>
              "In many of my classes our teachers have been training us to use
              “I statements” during discussions. For example, it applies when
              you fall into the habit of using we, or you, when you actually
              mean “I” in a statement, as I just did in this sentence. See what
              I did there? Every time I used we or you in that sentence, I
              really was referring to how I feel about the subject, but I was
              not using ownership language."
            </p>
            <figcaption>
              — Beth Lykins,{' '}
              <cite>
                <a
                  href="https://www.swc.edu/student-alum-stories/part-1-3-series-ownership-language/"
                  target="_blank"
                >
                  Part 1 of 3 in a Series About Ownership Language
                </a>
              </cite>
            </figcaption>
          </blockquote>
        </li>
        <li>
          <blockquote>
            <p>"self-responsible language"</p>
            <blockquote className="mx-5">
              <small className="text-muted">
                <p>
                  I'm hesitant to include this resource; I consider it a
                  misleading example of ownership language. He injects wacky
                  embelishments, twists for self-empowerment, and hidden
                  formulaic if-then certainties.
                </p>
                <p>
                  But it's a video resource which you may like. I find it
                  entertaining. And it's a potential talking point for further
                  disambguation of terms and methodologies.
                </p>
                <figcaption>— Geoffrey Hale</figcaption>
              </small>
            </blockquote>
            <figcaption>
              — Thomas Haller,{' '}
              <cite>
                <a href="https://vimeo.com/123997338" target="_blank">
                  TTA: Ownership Language
                </a>
              </cite>
            </figcaption>
          </blockquote>
        </li>
        <li>
          <blockquote>
            <blockquote className="mx-5">
              <small className="text-muted">
                <p>
                  This video hurts my heart. It condones manipulative/misleading
                  communication in the name of "ownership language". Please do
                  not do this. Please approach all communication on this site
                  with a spirit of honesty, authenticity, and integrity.
                </p>
                <figcaption>— Geoffrey Hale</figcaption>
              </small>
            </blockquote>
            <figcaption>
              — Cory Henwood,{' '}
              <cite>
                <a
                  href="https://www.youtube.com/watch?v=NQAZps4Phlw"
                  target="_blank"
                >
                  Ownership Language
                </a>
              </cite>
            </figcaption>
          </blockquote>
        </li>
      </ul>
    ),
  },
  istatements: {
    available: true,
    room: 'healthyrelating',
    title: '"I" Statements',
    description: (
      <blockquote>
        <p>
          "In many of my classes our teachers have been training us to use “I
          statements” during discussions. For example, it applies when you fall
          into the habit of using we, or you, when you actually mean “I” in a
          statement, as I just did in this sentence. See what I did there? Every
          time I used we or you in that sentence, I really was referring to how
          I feel about the subject, but I was not using ownership language."
        </p>
        <figcaption>
          — Beth Lykins,{' '}
          <cite>
            <a
              href="https://www.swc.edu/student-alum-stories/part-1-3-series-ownership-language/"
              target="_blank"
            >
              Part 1 of 3 in a Series About Ownership Language
            </a>
          </cite>
        </figcaption>
      </blockquote>
    ),
  },
  somaticcheckin: {
    available: true,
    room: 'healthyrelating',
    title: 'Somatic Check-In',
    description: (
      <>
        <p>Relating to the body, especially as distinct from the mind.</p>
        <p>Notice how you are feeling right now in your body.</p>
        <p>More:</p>
        <ul>
          <li>
            <a
              href="https://gravitywerks.com/a-somatic-check-in-anyone-can-do/"
              target="_blank"
            >
              A Somatic Check-in Anyone Can Do
            </a>
          </li>
        </ul>
      </>
    ),
  },
  reflection: {
    available: true,
    room: 'productivity',
    title: 'Reflection',
    description: (
      <>
        <ul>
          <li>
            <blockquote>
              <p>
                ...if you and your team stop working 15-minutes before you walk
                out the office door or log off your computer and reflect on what
                you learned, you can boost productivity over 20 percent.
              </p>
              <ul>
                <li>
                  Boosts productivity quickly — In just 10 days it increases
                  performance double digits.
                </li>
                <li>
                  Has a lasting impact — A month later the employees still had a
                  noticeably higher level of productivity.
                </li>
              </ul>
              <ul>
                <li>Translating experiences into practical wisdom</li>
                <li>Building confidence and motivation</li>
              </ul>
              <p>15 minutes daily, what few lessons have you learned today?</p>
              <figcaption>
                — Ben Fanning{' '}
                <cite>
                  <a
                    href="https://www.benfanning.com/boost-team-productivity/"
                    target="_blank"
                  >
                    This Counterintuitive Work Strategy Boosts Productivity Over
                    20%
                  </a>
                </cite>
              </figcaption>
            </blockquote>
          </li>
          <li>
            <blockquote>
              <ul>
                <li>Question 1: What’s working that you can do more of?</li>
                <li>
                  Question 2: What’s not working and would you like to do
                  differently?
                </li>
                <li>Question 3: What’s one thing you’ve learned?</li>
              </ul>
              <figcaption>
                — Ben Fanning{' '}
                <cite>
                  <a
                    href="https://gravitywerks.com/a-somatic-check-in-anyone-can-do/"
                    target="_blank"
                  >
                    A Somatic Check-in Anyone Can Do
                  </a>
                </cite>
              </figcaption>
            </blockquote>
          </li>
        </ul>
      </>
    ),
  },
});

export const Modality = ({ modality, postId }) => {
  const { user } = useContext(AppContext);
  const { uid } = user;
  const myExistingVote = modality.votes ? modality.votes[uid] : null;

  return (
    <ButtonGroup>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <Popover>
            <Popover.Title as={'h3'}>
              What is {MODALITIES[modality.name].title}?
            </Popover.Title>
            <Popover.Content>
              {MODALITIES[modality.name].description}
              {VoteDescription}
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="warning">{MODALITIES[modality.name].title}</Button>
      </OverlayTrigger>
      <Button
        variant={myExistingVote === true ? 'warning' : 'outline-warning'}
        onClick={() =>
          setModalityVote({
            postId,
            uid,
            vote: myExistingVote === true ? null : true,
          })
        }
      >
        yes
        <Badge variant="secondary" className="ml-2">
          {modality.votes
            ? Object.values(modality.votes).filter((vote) => vote === true)
                .length
            : 0}
        </Badge>
      </Button>
      <Button
        variant={myExistingVote === false ? 'warning' : 'outline-warning'}
        onClick={() =>
          setModalityVote({
            postId,
            uid,
            vote: myExistingVote === false ? null : false,
          })
        }
      >
        no
        <Badge variant="secondary" className="ml-2">
          {modality.votes
            ? Object.values(modality.votes).filter((vote) => vote === false)
                .length
            : 0}
        </Badge>
      </Button>
    </ButtonGroup>
  );
};
