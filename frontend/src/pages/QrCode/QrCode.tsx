import { FC, useEffect, useState } from 'react';
import { IonButton, IonItem, IonSelect, IonSelectOption, IonSkeletonText, IonToggle } from '@ionic/react';
import QRCodeGenerator from 'react-qr-code';
import { useParams } from 'react-router';

import { Base58 } from '~/utils/base58';
import Page from '~/components/Page';
import environment from '~/environment';
import { useAppDispatch } from '~/redux/hooks';
import { loadQrCode, useQrCode } from '~/redux/qrCodeSlice';
import { typesMap, TypesMapKeys } from '~/types/typesMap';
import classes from './QrCode.module.scss';

const base58 = new Base58();

const QrCode: FC = () => {
  const { QR_CODE_URL } = environment;
  const { slug, base58Id } = useParams<{ slug: string; base58Id: string }>();
  const [size, setSize] = useState(+(localStorage.getItem('qr-code-size') || 256));
  const [background, setBackground] = useState((localStorage.getItem('qr-code-background') || 'true') === 'true');
  const qrCode = useQrCode();
  const dispatch = useAppDispatch();
  const shortName = qrCode.error ? '-' : `${typesMap[slug as TypesMapKeys]}${base58Id}`;

  useEffect(() => {
    dispatch(loadQrCode({ type: slug, id: base58.decode(base58Id) }));
  }, [slug, base58Id, dispatch]);

  const onImageDownload = () => {
    const svg = document.getElementById('QRCode');
    if (svg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
          canvas.width = size;
          canvas.height = size + (size / 16) * 1.5;
          if (background) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, size / 16, size / 16, size - size / 8, size - size / 8);
          ctx.fillStyle = '#000';
          ctx.fillStyle = '#000';
          ctx.font = `${(size / 16) * 1.5}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(`Valeur: ${shortName}`, canvas.width / 2, size + (canvas.height - size) / 2);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `QRCode_${qrCode.data?.value.name}`;
          downloadLink.href = `${pngFile}`;
          downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      }
    }
  };

  const handleSizeChange = (e: CustomEvent) => {
    const size = parseInt(e.detail.value);
    localStorage.setItem('qr-code-size', `${size}`);
    setSize(size);
  };

  const handleBackgroundChange = (e: CustomEvent) => {
    const checked = e.detail.checked;
    console.log(checked);
    localStorage.setItem('qr-code-background', checked);
    setBackground(checked);
  };

  return (
    <Page title="Qr Code" backButton={true} defaultBackUrl={slug === 'pack' ? '/packs/' : '/stock/'} backText={'Stock'}>
      <div className={classes.qr_code_page}>
        <IonItem>
          <IonSelect
            label="Taille"
            interface="popover"
            placeholder={'Size'}
            value={`${size}`}
            onIonChange={handleSizeChange}
          >
            <IonSelectOption value="128">x128</IonSelectOption>
            <IonSelectOption value="256">x256</IonSelectOption>
            <IonSelectOption value="512">x512</IonSelectOption>
            <IonSelectOption value="1024">x1024</IonSelectOption>
            <IonSelectOption value="2048">x2048</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonToggle checked={background} onIonChange={handleBackgroundChange}>
            Fond blanc
          </IonToggle>
        </IonItem>
        <div className={classes.content}>
          <h2 style={{ color: !qrCode.isLoading && qrCode.error ? 'var(--ion-color-danger, #f00)' : undefined }}>
            <>
              {qrCode.isLoading && (
                <IonSkeletonText animated style={{ width: '75%', height: '26px', margin: 'auto' }} />
              )}
              {qrCode.error ? qrCode.error : qrCode.data?.value.name}
            </>
          </h2>
          <div className={classes.qr_code_container}>
            <div style={{ margin: `${size / 16}px` }}>
              <QRCodeGenerator
                id="QRCode"
                value={`${QR_CODE_URL}/qr/${qrCode.data?.type}/${base58Id}/`}
                size={size - size / 8}
                bgColor={background ? '#fff' : '#00000000'}
                fgColor={qrCode.isLoading || qrCode.error ? '#fff' : undefined}
              />
            </div>
            <p style={{ margin: `${size / 16}px` }}>Valeur: {shortName}</p>
          </div>
        </div>

        <IonButton expand="block" onClick={onImageDownload} disabled={qrCode.isLoading || !!qrCode.error}>
          Télécharger le QR Code
        </IonButton>
      </div>
    </Page>
  );
};

export default QrCode;
