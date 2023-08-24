import React from 'react';
import { IonProgressBar } from '@ionic/react';
import { useNProgress } from '@tanem/react-nprogress';

import classes from './LoadingBar.module.scss';

const LoadingBar: React.FC<{ show: boolean }> = ({ show }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: show,
  });

  return (
    <div
      className={classes.container}
      style={{ transitionDuration: `${animationDuration}ms`, opacity: isFinished ? 0 : 1 }}
    >
      <IonProgressBar value={progress} />
    </div>
  );
};

export default LoadingBar;
