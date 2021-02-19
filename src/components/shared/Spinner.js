import React from 'react';
import BootstrapSpinner from 'react-bootstrap/Spinner';

const SpinnerCore = ({ size }) => (
  <BootstrapSpinner
    animation="border"
    role="status"
    variant="primary"
    size={size}
  >
    <span className="sr-only">Loading...</span>
  </BootstrapSpinner>
);

const Spinner = ({ size }) =>
  size === 'lg' ? (
    <div style={{ textAlign: 'center', fontSize: '10rem' }}>
      <SpinnerCore />
    </div>
  ) : (
    <SpinnerCore size={size} />
  );

export default Spinner;
