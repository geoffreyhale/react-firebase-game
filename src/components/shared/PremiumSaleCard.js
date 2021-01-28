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
          <li>Community Page</li>
          <li>Remove this ad</li>
          <li>Support your friend (me)</li>
          <li>More coming soon</li>
        </ul>
        <p>
          Ask how to join in <Link to="/r/general">r/general</Link>.
        </p>
      </Card.Body>
    </Card>
  );
};

export default PremiumSaleCard;
