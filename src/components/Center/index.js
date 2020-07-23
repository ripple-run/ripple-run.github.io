import React from 'react';
import styles from './styles.module.css';

export default function Center(props) {
  return (
    <div
      className={styles.center}
      style={{
        width: props.width || 'auto',
        height: props.height || 'auto',
      }}
    >
      {props.children}
    </div>
  );
}
