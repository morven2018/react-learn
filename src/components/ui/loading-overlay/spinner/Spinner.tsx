import React from 'react';
import styles from './Spinner.module.scss';

class Spinner extends React.Component {
  render() {
    return <div className={styles.spinner} aria-label="Loading"></div>;
  }
}

export default Spinner;
