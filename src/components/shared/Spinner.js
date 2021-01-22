import React from 'react';
import BootstrapSpinner from 'react-bootstrap/Spinner';

const Spinner = () => (
  <BootstrapSpinner animation="border" role="status" variant="primary">
    <span className="sr-only">Loading...</span>
  </BootstrapSpinner>
);

export default Spinner;
