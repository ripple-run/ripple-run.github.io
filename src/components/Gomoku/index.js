import React, { useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { Gomoku as G } from './gomoku';

export default function Gomoku(props = {}) {
  const mainRef = useRef();
  const boardRef = useRef();
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!isSupportCanvas(boardEl)) {
      return;
    }
    let gomoku = new G({
      boardEl,
      mainEl: mainRef.current,
      bgColor: '#d3b36a',
      ...props,
    });
    gomoku.run();
    return () => {
      gomoku.destroy();
      gomoku = null;
    };
  });
  return (
    <div className={styles.gomoku}>
      <canvas ref={boardRef} className={styles.board}>
        <NotSupport />
      </canvas>
      <canvas ref={mainRef} className={styles.main}>
        <NotSupport />
      </canvas>
    </div>
  );
}

function NotSupport() {
  return <p>your browser not support canvas</p>;
}

function isSupportCanvas(el) {
  return el.getContext && el.getContext('2d');
}
