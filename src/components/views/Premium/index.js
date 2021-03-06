import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { PremiumSaleCard } from '../../shared/Premium';
import { AppContext } from '../../AppProvider';
import friendlyTimestamp from '../../shared/friendlyTimestamp';

const UserPremium = () => {
  const { user } = useContext(AppContext);
  return (
    <span>
      {user.isPremium ? (
        <>
          You have premium until{' '}
          {friendlyTimestamp(user.premium.seconds * 1000)}.
        </>
      ) : (
        'You do not have premium.'
      )}
    </span>
  );
};

const PremiumPage = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Premium</Card.Title>
        <Card>
          <Card.Body>
            <UserPremium />
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};
export default PremiumPage;
