import React from 'react';
import BootstrapSpinner from 'react-bootstrap/Spinner';

const Spinner = ({ size }) => (
  <BootstrapSpinner
    animation="border"
    role="status"
    variant="primary"
    size={size}
  >
    <span className="sr-only">Loading...</span>
  </BootstrapSpinner>
);

export default Spinner;
