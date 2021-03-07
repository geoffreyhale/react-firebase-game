import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const HowToGetPremium = () => {
  const location = useLocation();
  const active = location.pathname.startsWith('/premium');
  return (
    <NavLink to="/premium" active={active.toString()}>
      Get Premium
    </NavLink>
  );
};
export default HowToGetPremium;
