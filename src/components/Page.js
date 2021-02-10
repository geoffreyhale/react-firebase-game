import React, { useEffect } from 'react';

const Page = ({ children, title }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  return children;
};
export default Page;
