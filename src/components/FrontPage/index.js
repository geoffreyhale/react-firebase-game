/**
 * FrontPage is intended to serve as home for unauthorized users
 */
import React from 'react';
import About from '../About';

const FrontPage = () => (
  <>
    {/* <Card className="mt-1">
      <Card.Body
        style={{
          paddingBottom: '0.25rem',
          paddingTop: '0.25rem',
        }}
      >
        <div>
          <small className="text-muted">
            <em>
              New online community that will never sell your data.
              <br />
              Join the discussion now for free.
            </em>
          </small>
        </div>
      </Card.Body>
    </Card> */}
    <div className="mt-3">
      <About />
    </div>
  </>
);
export default FrontPage;
