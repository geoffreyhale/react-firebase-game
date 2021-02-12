import React from 'react';

const SelfHighlightingWord = ({ children, content }) => (
  <span style={{ fontWeight: content.includes(children) ? 900 : 'inherit' }}>
    {children}
  </span>
);

const EmotionalAwareness = ({ content }) => {
  const containsHappy = content.includes('happy');
  return (
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
          <SelfHighlightingWord content={content}>
            surprise
          </SelfHighlightingWord>
        </li>
        <li>
          <SelfHighlightingWord content={content}>disgust</SelfHighlightingWord>
          /<SelfHighlightingWord content={content}>anger</SelfHighlightingWord>
        </li>
      </ul>
    </>
  );
};
export default EmotionalAwareness;
