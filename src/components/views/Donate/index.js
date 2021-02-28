import React, { useContext, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { UserPhoto } from '../../shared/User';
import Spinner from '../../shared/Spinner';
import { getAccounting } from '../../../api';
import { AppContext } from '../../AppProvider';

const TopDonors = () => {
  const { users } = useContext(AppContext);
  const [topDonations, setTopDonations] = useState({});

  useEffect(() => {
    getAccounting((accounting) => {
      setTopDonations(
        Object.values(accounting)
          .filter((record) => record.type === 'donation')
          .sort((a, b) => b.usd - a.usd)
          .map((record) => ({
            uid: record.uid,
            usd: record.usd,
            displayName: users[record.uid].displayName,
          }))
      );
    });
  }, []);

  return (
    <>
      <Card.Title>Top Donors</Card.Title>
      <ol style={{ fontSize: '200%' }}>
        {topDonations ? (
          Object.values(topDonations).map((donation) => (
            <li>
              ${donation.usd}
              <span className={'ml-2'}>
                <UserPhoto uid={donation.uid} roundedCircle={true} />
              </span>
              <span className={'ml-2'}>{donation.displayName}</span>
            </li>
          ))
        ) : (
          <Spinner size={'sm'} />
        )}
      </ol>
    </>
  );
};

const Donate = () => (
  <Card>
    <Card.Body>
      <Card.Title>How To Donate</Card.Title>
      <p>
        Personal donations are graciously accepted:
        <ul>
          <li>Cash in person</li>
          <li>Venmo @geoffreyhale</li>
          <li>
            PayPal geoffreyhale@gmail.com ("Sending to a friend" to avoid fees)
          </li>
        </ul>
      </p>
      <p>
        When sending a donation, please specify:
        <ul>
          <li>
            "donation" (to differentiate from purchase of premium for an
            account)
          </li>
          <li>
            whether to add or omit you from the Top Donors list
            <ul>
              <li>
                what xBook account (by e-mail address) or unlinked name ("John
                Smith") or some such similar "in honor/memory of" to use
              </li>
            </ul>
          </li>
        </ul>
      </p>
      <TopDonors />
    </Card.Body>
  </Card>
);
export default Donate;
