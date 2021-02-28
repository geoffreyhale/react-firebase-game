import React from 'react';
import Card from 'react-bootstrap/Card';

const Donate = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>How To Donate</Card.Title>
        <p>
          Personal donations are graciously accepted:
          <ul>
            <li>Cash in person</li>
            <li>Venmo @geoffreyhale</li>
            <li>
              PayPal geoffreyhale@gmail.com ("Sending to a friend" to avoid
              fees)
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
        <Card.Title>Top Donors</Card.Title>
        <ol>
          <li>TBD</li>
          <li>TBD</li>
          <li>TBD</li>
        </ol>
      </Card.Body>
    </Card>
  );
};
export default Donate;
