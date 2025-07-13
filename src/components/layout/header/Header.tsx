import React from 'react';
import logo from '@assets/images/image.png';

class Header extends React.Component {
  render() {
    return (
      <header>
        <img src={logo} alt="Star Wars" />
        <div>
          <h2>Middle Earth</h2>
          <h3>Search.</h3>
        </div>
      </header>
    );
  }
}

export default Header;
