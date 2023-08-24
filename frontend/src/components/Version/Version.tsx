import { FC } from 'react';
import { useToast } from '@agney/ir-toast';
import { ToastButton } from '@ionic/react';
import { closeOutline, closeSharp } from 'ionicons/icons';

import environment from '~/environment';
import classes from './Version.module.scss';

const Version: FC = () => {
  const version = `v${environment.VERSION_NUMBER}`;
  const commit = `Commit SHA: ${environment.VERSION_GIT_SHA}`;

  const Toast = useToast();

  const button = {
    role: 'dismiss',
    icon: {
      md: closeSharp,
      ios: closeOutline,
    },
  } as unknown as ToastButton; // TODO Fix import. Is it an ionic or ir-toast error ?

  const handleClick = () => {
    Toast.create({
      message: commit,
      color: 'medium',
      duration: undefined,
      buttons: [button],
    }).present();
  };

  return (
    <span className={classes.version} title={commit} onClick={handleClick}>
      {version}
    </span>
  );
};

export default Version;
