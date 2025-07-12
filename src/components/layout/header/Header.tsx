import React from 'react';
import logo from '@assets/images/name.png';

class Header extends React.Component {
  render() {
    return (
      <header>
        <img src={logo} alt="Star Wars" />
        <h2>Search</h2>
      </header>
    );
  }
}

export default Header;
