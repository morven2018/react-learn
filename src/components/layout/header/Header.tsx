import React from 'react';
import logo from '@assets/images/image.png';
import style from './Header.module.scss';

class Header extends React.Component {
  render() {
    return (
      <header className={style.header}>
        <img src={logo} alt="White tree" className={style.whiteTree} />
        <div>
          <h1 className={style.h1}>Middle Earth</h1>
          <h2 className={style.subheader}>Search</h2>
        </div>
      </header>
    );
  }
}

export default Header;
