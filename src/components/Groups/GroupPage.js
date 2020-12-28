import React from 'react';
import { useParams } from 'react-router-dom';

const GroupPage = () => {
  let { groupId } = useParams();
  return (
    <div>
      <h2>Congratulations!</h2>
      <p>
        You found group page for id:
        <br /> <strong>{groupId}</strong>
      </p>
      <p>
        Page functionality <em>under construction</em>!
      </p>
    </div>
  );
};

export default GroupPage;
