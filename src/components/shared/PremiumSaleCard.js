import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const PremiumSaleCard = () => {
  const premiumSaleCardVariants = [
    'success',
    'danger',
    'warning',
    'info',
    'dark',
  ];
  const randomPremiumSaleCardVariant =
    premiumSaleCardVariants[
      Math.floor(Math.random() * premiumSaleCardVariants.length)
    ];
  return (
    <Card className="mb-3" bg={randomPremiumSaleCardVariant} text="white">
      <Card.Body>
        <Card.Title>Premium Sale &#11088;</Card.Title>
        <p>Join us for just $1/mo!</p>
        <h5>Features</h5>
        <ul>
          <li>View user profiles</li>
          <li>Access to premium rooms</li>
          <li>Access to Modality Trainer</li>
          <li>Access to Community Page</li>
          <li>Edit your posts</li>
          <li>Select a username</li>
          <li>Remove this ad</li>
        </ul>
        <p>
          Ask how to join in <Link to="/r/general">r/general</Link>.
        </p>
      </Card.Body>
    </Card>
  );
};

export default PremiumSaleCard;
