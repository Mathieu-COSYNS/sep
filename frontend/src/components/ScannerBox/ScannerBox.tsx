import React, { useRef, useEffect, useReducer } from 'react';
import QrReader from 'react-qr-reader';
import { useLocation } from 'react-router';
import { IonSpinner, IonButton, IonIcon } from '@ionic/react';
import { usePageVisibility } from 'react-page-visibility';
import { cloudUpload } from 'ionicons/icons';
import { useToast } from '@agney/ir-toast';
import classes from './ScannerBox.module.scss';

interface State {
  loading: boolean;
  enableCamera: boolean;
  legacy: boolean;
  legacyLoadPending: boolean;
}

type Action =
  | {
      type: 'IS_LOADING' | 'IS_LEGACY_LOAD_PENDING';
      payload: boolean;
    }
  | {
      type: 'ENABLE_CAMERA' | 'DISABLE_CAMERA' | 'ENABLE_LEGACY_MODE';
    };

const initialState: State = {
  loading: true,
  enableCamera: false,
  legacy: false,
  legacyLoadPending: false,
};

const stateReducer = (prevState: State, action: Action): State => {
  switch (action.type) {
    case 'IS_LOADING':
      return { ...prevState, loading: action.payload };
    case 'ENABLE_CAMERA':
      return { ...prevState, loading: true, enableCamera: true };
    case 'DISABLE_CAMERA':
      return { ...prevState, loading: false, enableCamera: false };
    case 'ENABLE_LEGACY_MODE':
      return { ...prevState, loading: false, legacy: true };
    case 'IS_LEGACY_LOAD_PENDING':
      return { ...prevState, loading: action.payload, legacyLoadPending: action.payload };
    default:
      throw new Error('Unsupported action');
  }
};

const ScannerBox: React.FC<{
  enableOnlyOnRoute?: string;
  onScan: (result: string) => void;
}> = ({ enableOnlyOnRoute, onScan }) => {
  const [state, stateDispatcher] = useReducer(stateReducer, initialState);

  const location = useLocation();
  const isVisible = usePageVisibility();
  const ref = useRef<QrReader>(null);

  const Toast = useToast();

  useEffect(() => {
    if (isVisible && (!enableOnlyOnRoute || enableOnlyOnRoute === location.pathname)) {
      stateDispatcher({ type: 'ENABLE_CAMERA' });
    } else {
      stateDispatcher({ type: 'DISABLE_CAMERA' });
    }
  }, [isVisible, location, enableOnlyOnRoute]);

  const handleScan = (data: string | null) => {
    if (state.legacyLoadPending) {
      stateDispatcher({ type: 'IS_LEGACY_LOAD_PENDING', payload: false });

      if (!data) {
        Toast.error("L'image scannée n'est pas un QR code valide");
      }
    }

    if (data) {
      onScan(data);
      stateDispatcher({ type: 'IS_LOADING', payload: false });
    }
  };

  const handleError = () => {
    stateDispatcher({ type: 'ENABLE_LEGACY_MODE' });
  };

  const handleLoad = () => {
    stateDispatcher({ type: 'IS_LOADING', payload: false });
  };

  const handleLegacyLoad = () => {
    stateDispatcher({ type: 'IS_LEGACY_LOAD_PENDING', payload: true });
  };

  const openImageDialog = () => {
    try {
      ref.current?.openImageDialog();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={classes.scanner_box}>
      {state.loading && (
        <div className={classes.loading_container}>
          <IonSpinner />
        </div>
      )}
      {!state.loading && state.legacy && (
        <div className={classes.legacy_container}>
          <div>
            <p>Aucun accès à la caméra</p>
            <IonButton type="button" onClick={openImageDialog}>
              <IonIcon icon={cloudUpload} slot="start" />
              Ajouter une image
            </IonButton>
          </div>
        </div>
      )}
      {state.enableCamera && (
        <QrReader
          className={classes.qr_scanner}
          ref={ref}
          delay={300}
          onError={handleError}
          onScan={handleScan}
          onLoad={handleLoad}
          onImageLoad={handleLegacyLoad}
          legacyMode={state.legacy}
          style={{ opacity: state.legacy ? 0 : 1 }}
        />
      )}
    </div>
  );
};

export default ScannerBox;
