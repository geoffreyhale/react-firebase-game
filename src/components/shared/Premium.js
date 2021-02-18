import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

export const PremiumFeature = ({ featureName }) => (
  <Card>
    <Card.Body>
      <Card.Title>Premium Feature</Card.Title>
      <p>
        {featureName ? <strong>{featureName}</strong> : 'This'} is a premium
        feature available to paying users.
      </p>
      <span>
        Ask how to sign up for premium for just $1/mo in{' '}
        <Link to="/r/general">r/general</Link>.
      </span>
    </Card.Body>
  </Card>
);
