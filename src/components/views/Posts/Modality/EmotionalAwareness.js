import React from 'react';

//TODO improve the word matching for case and synonyms and not part of another word
//TODO 4 basic emotions description does not lead the user well into these More...Words
//TODO can make these More...Words things programmatic and also bold ...
//TODO also show definitions when word is used
//TODO bold/highlight the word in the textarea when used
//TODO ability to collapse the sections
//TODO don't bounce the textarea
//TODO expand sections when user writes words within sections

const MoreAngerWords = () => (
  <div className="mt-3">
    <h5>Anger</h5>
    <h6>Soft Anger and Apathy</h6>
    <p>
      Annoyed ~ Apathetic ~ Bored ~ Certain ~ Cold ~ Crabby ~ Cranky ~ Critical
      ~ Cross ~ Detached ~ Displeased ~ Frustrated ~ Impatient ~ Indifferent ~
      Irritated ~ Peeved ~ Rankled
    </p>
    <h6>Medium Anger</h6>
    <p>
      Affronted ~ Aggravated ~ Angry ~ Antagonized ~ Arrogant ~ Bristling ~
      Exasperated ~ Incensed ~ Indignant ~ Inflamed ~ Mad ~ Offended ~ Resentful
      ~ Riled up ~ Sarcastic
    </p>
    <h6>Intense Anger and Hatred</h6>
    <p>
      Aggressive ~ Appalled ~ Belligerent ~ Bitter ~ Contemptuous ~ Disgusted ~
      Furious ~ Hateful ~ Hostile ~ Irate ~ Livid ~ Menacing ~ Outraged ~
      Ranting ~ Raving ~ Seething ~ Spiteful ~ Vengeful ~ Vicious ~ Vindictive ~
      Violent
    </p>
    <cite className="small text-muted">
      — Karla McLaren,{' '}
      <a
        href="https://karlamclaren.com/emotional-vocabulary-page/"
        target="_blank"
      >
        Emotional Vocabulary
      </a>
    </cite>
  </div>
);
const MoreFearWords = () => (
  <div className="mt-3">
    <h5>Fear</h5>
    <h6>Soft Fear and Anxiety</h6>
    <p>
      Alert ~ Apprehensive ~ Cautious ~ Concerned ~ Confused ~ Curious ~
      Disconcerted ~ Disoriented ~ Disquieted ~ Doubtful ~ Edgy ~ Fidgety ~
      Hesitant ~ Indecisive ~ Insecure ~ Instinctive ~ Intuitive ~ Leery ~
      Pensive ~ Shy ~ Timid ~ Uneasy ~ Watchful
    </p>
    <h6>Medium Fear and Anxiety</h6>
    <p>
      Afraid ~ Alarmed ~ Anxious ~ Aversive ~ Distrustful ~ Fearful ~ Jumpy ~
      Nervous ~ Perturbed ~ Rattled ~ Shaky ~ Startled ~ Suspicious ~ Unnerved ~
      Unsettled ~ Wary ~ Worried
    </p>
    <h6>Intense Fear and Panic</h6>
    <p>
      Filled with Dread ~ Horrified ~ Panicked ~ Paralyzed ~ Petrified ~ Phobic
      ~ Shocked ~ Terrorized
    </p>
    <cite className="small text-muted">
      — Karla McLaren,{' '}
      <a
        href="https://karlamclaren.com/emotional-vocabulary-page/"
        target="_blank"
      >
        Emotional Vocabulary
      </a>
    </cite>
  </div>
);

const MoreHappyWords = () => (
  <div className="mt-3">
    <h5>Happy</h5>
    <h6>Soft Happiness</h6>
    <p>
      Amused ~ Calm ~ Encouraged ~ Friendly ~ Hopeful ~ Inspired ~ Jovial ~ Open
      ~ Peaceful ~ Smiling Upbeat
    </p>
    <h6>Medium Happiness and Contentment</h6>
    <p>
      Cheerful ~ Contented ~ Delighted ~ Excited ~ Fulfilled ~ Glad ~ Gleeful ~
      Gratified ~ Happy ~ Healthy Self-esteem ~ Joyful ~ Lively ~ Merry ~
      Optimistic ~ Playful ~ Pleased ~ Proud ~ Rejuvenated ~ Satisfied
    </p>
    <h6>Intense Happiness, Contentment, and Joy</h6>
    <p>
      Awe-filled ~ Blissful ~ Ecstatic ~ Egocentric ~ Elated ~ Enthralled ~
      Euphoric ~ Exhilarated ~ Giddy ~ Jubilant ~ Manic ~ Overconfident ~
      Overjoyed ~ Radiant ~ Rapturous ~ Self-aggrandized ~ Thrilled
    </p>
    <cite className="small text-muted">
      — Karla McLaren,{' '}
      <a
        href="https://karlamclaren.com/emotional-vocabulary-page/"
        target="_blank"
      >
        Emotional Vocabulary
      </a>
    </cite>
  </div>
);

const MoreSadWords = () => (
  <div className="mt-3">
    <h5>Sad</h5>
    <h6>Soft Sadness</h6>
    <p>
      Contemplative ~ Disappointed ~ Disconnected ~ Distracted ~ Grounded ~
      Listless ~ Low ~ Regretful ~ Steady ~ Wistful
    </p>
    <h6>Medium Sadness, Depression, and Grief</h6>
    <p>
      Dejected ~ Discouraged ~ Dispirited ~ Down ~ Downtrodden ~ Drained ~
      Forlorn ~ Gloomy ~ Grieving ~ Heavy-hearted ~ Melancholy ~ Mournful ~ Sad
      ~ Sorrowful ~ Weepy ~ World-weary
    </p>
    <h6>Intense Sadness, Depression, and Grief</h6>
    <p>
      Anguished ~ Bereaved ~ Bleak ~ Depressed ~ Despairing ~ Despondent ~
      Grief-stricken ~ Heartbroken ~ Hopeless ~ Inconsolable ~ Morose
    </p>
    <cite className="small text-muted">
      — Karla McLaren,{' '}
      <a
        href="https://karlamclaren.com/emotional-vocabulary-page/"
        target="_blank"
      >
        Emotional Vocabulary
      </a>
    </cite>
  </div>
);

const MoreShameGuiltWords = () => (
  <div className="mt-3">
    <h5>Shame/Guilt</h5>
    <h6>Soft Shame and Guilt</h6>
    <p>
      Abashed ~ Awkward ~ Discomfited ~ Flushed ~ Flustered ~ Hesitant ~ Humble
      ~ Reticent ~ Self-conscious ~ Speechless ~ Withdrawn
    </p>
    <h6>Medium Shame and Guilt</h6>
    <p>
      Ashamed ~ Chagrined ~ Contrite ~ Culpable ~ Embarrassed ~ Guilty ~ Humbled
      ~ Intimidated ~ Penitent ~ Regretful ~ Remorseful ~ Reproachful ~ Rueful ~
      Sheepish
    </p>
    <h6>Intense Shame and Guilt</h6>
    <p>
      Belittled ~ Degraded ~ Demeaned ~ Disgraced ~ Guilt-ridden ~
      Guilt-stricken ~ Humiliated ~ Mortified ~ Ostracized ~ Self-condemning ~
      Self-flagellating ~ Shamefaced ~ Stigmatized
    </p>
    <cite className="small text-muted">
      — Karla McLaren,{' '}
      <a
        href="https://karlamclaren.com/emotional-vocabulary-page/"
        target="_blank"
      >
        Emotional Vocabulary
      </a>
    </cite>
  </div>
);

const MoreJealousyEnvyWords = () => (
  <div className="mt-3">
    <h5>Jealousy/Envy</h5>
    <h6>Soft Jealousy and Envy</h6>
    <p>
      Disbelieving ~ Distrustful ~ Insecure ~ Protective ~ Suspicious ~
      Vulnerable
    </p>
    <h6>Medium Jealousy and Envy</h6>
    <p>Covetous ~ Demanding ~ Desirous ~ Envious ~ Jealous ~ Threatened</p>
    <h6>Intense Jealousy and Envy</h6>
    <p>
      Avaricious ~ Gluttonous ~ Grasping ~ Greedy ~ Green with Envy ~
      Persistently Jealous ~ Possessive ~ Resentful
    </p>
    <cite className="small text-muted">
      — Karla McLaren,{' '}
      <a
        href="https://karlamclaren.com/emotional-vocabulary-page/"
        target="_blank"
      >
        Emotional Vocabulary
      </a>
    </cite>
  </div>
);

const MoreSuicidalUrgeWords = () => (
  <div className="mt-3">
    <h5>Suicidal Urge</h5>
    <h6>Soft Suicidal Urges</h6>
    <p>
      Apathetic ~ Constantly Irritated, Angry, or Enraged (see the Anger list) ~
      Depressed ~ Discouraged ~ Disinterested ~ Dispirited ~ Feeling Worthless ~
      Flat ~ Helpless ~ Humorless ~ Impulsive ~ Indifferent ~ Isolated ~
      Lethargic ~ Listless ~ Melancholy ~ Pessimistic ~ Purposeless ~ Withdrawn
      ~ World-weary
    </p>
    <h6>Medium Suicidal Urges</h6>
    <p>
      Bereft ~ Crushed ~ Desolate ~ Despairing ~ Desperate ~ Drained ~ Empty ~
      Fatalistic ~ Hopeless ~ Joyless ~ Miserable ~ Morbid ~ Overwhelmed ~
      Passionless ~ Pleasure-less ~ Sullen
    </p>
    <h6>Intense Suicidal Urges</h6>
    <p>
      Agonized ~ Anguished ~ Bleak ~ Death-seeking ~ Devastated ~ Doomed ~
      Gutted ~ Nihilistic ~ Numbed ~ Reckless ~ Self-destructive ~ Suicidal ~
      Tormented ~ Tortured
    </p>
    <cite className="small text-muted">
      — Karla McLaren,{' '}
      <a
        href="https://karlamclaren.com/emotional-vocabulary-page/"
        target="_blank"
      >
        Emotional Vocabulary
      </a>
    </cite>
  </div>
);

const SelfHighlightingWord = ({ children, content }) => (
  <span style={{ fontWeight: content.includes(children) ? 900 : 'inherit' }}>
    {children}
  </span>
);

const FourBasicEmotions = ({ content }) => (
  <>
    <h4
      title="Dr Rachael E Jack's 4 Basic (Psychologically Irreducible) Categories of
        (Facial Expression of) Emotion"
    >
      4 Basic Emotions
    </h4>
    <small className="text-muted">
      Dr Rachael E Jack's 4 Basic (Psychologically Irreducible) Categories of
      (Facial Expression of) Emotion
    </small>
    <ul>
      <li>
        <SelfHighlightingWord content={content}>happy</SelfHighlightingWord>
      </li>
      <li>
        <SelfHighlightingWord content={content}>sad</SelfHighlightingWord>
      </li>
      <li>
        <SelfHighlightingWord content={content}>fear</SelfHighlightingWord>/
        <SelfHighlightingWord content={content}>surprise</SelfHighlightingWord>
      </li>
      <li>
        <SelfHighlightingWord content={content}>disgust</SelfHighlightingWord>/
        <SelfHighlightingWord content={content}>anger</SelfHighlightingWord>
      </li>
    </ul>
  </>
);

const EmotionalAwareness = ({ content }) => {
  content.includes('anger');

  return (
    <>
      <p>
        When you type the emotions below they will expand to show more detailed
        options.
      </p>
      {/* <FourBasicEmotions content={content} /> */}
      <ul>
        <li>
          <SelfHighlightingWord content={content}>anger</SelfHighlightingWord>
        </li>
        <li>
          <SelfHighlightingWord content={content}>fear</SelfHighlightingWord>
        </li>
        <li>
          <SelfHighlightingWord content={content}>happy</SelfHighlightingWord>
        </li>
        <li>
          <SelfHighlightingWord content={content}>sad</SelfHighlightingWord>
        </li>
        <li>
          <SelfHighlightingWord content={content}>shame</SelfHighlightingWord>/
          <SelfHighlightingWord content={content}>guilt</SelfHighlightingWord>
        </li>
        <li>
          <SelfHighlightingWord content={content}>jealous</SelfHighlightingWord>
          /<SelfHighlightingWord content={content}>envy</SelfHighlightingWord>
        </li>
        <li>
          <SelfHighlightingWord content={content}>
            suicidal
          </SelfHighlightingWord>
        </li>
      </ul>
      {content.includes('anger') && <MoreAngerWords />}
      {content.includes('fear') && <MoreFearWords />}
      {content.includes('happy') && <MoreHappyWords />}
      {content.includes('sad') && <MoreSadWords />}
      {(content.includes('shame') || content.includes('guilt')) && (
        <MoreShameGuiltWords />
      )}
      {(content.includes('jealous') || content.includes('envy')) && (
        <MoreJealousyEnvyWords />
      )}
      {content.includes('suicid') && <MoreSuicidalUrgeWords />}
    </>
  );
};
export default EmotionalAwareness;
