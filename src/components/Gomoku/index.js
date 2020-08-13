import React, { useRef, useEffect } from 'react';
import styles from './styles.module.css';
import { Gomoku as G } from './2d/gomoku';
import { Gomoku as GL } from './gl/gomoku';

export default function Gomoku({ webgl, ...props } = {}) {
  const mainRef = useRef();
  const boardRef = useRef();
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!isSupportCanvas(boardEl, webgl)) {
      return;
    }
    const Ctor = webgl ? GL : G;
    let gomoku = new Ctor({
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

function isSupportCanvas(el, webgl = false) {
  return el.getContext && el.getContext(webgl ? 'webgl' : '2d');
}
