import React from 'react';

export default class Sandbox extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  render() {
    console.log('render');

    return <div>sandbox</div>;
  }
}
