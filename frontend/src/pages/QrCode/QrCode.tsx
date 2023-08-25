import { FC, useMemo, useState } from 'react';
import { IonButton, IonItem, IonSelect, IonSelectOption, IonSkeletonText, IonToggle } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import QRCodeGenerator from 'react-qr-code';
import { useParams } from 'react-router';

import { Base58 } from '~/utils/base58';
import { serializeError } from '~/utils/errors';
import { fetchQrCode } from '~/api/QrCodeAPI';
import Page from '~/components/Page';
import environment from '~/environment';
import { typesMap, TypesMapKeys } from '~/types/typesMap';
import classes from './QrCode.module.scss';

const base58 = new Base58();

const QrCode: FC = () => {
  const { QR_CODE_URL } = environment;
  const { slug, base58Id } = useParams<{ slug: 'product' | 'pack'; base58Id: string }>();
  const [size, setSize] = useState(+(localStorage.getItem('qr-code-size') || 256));
  const [background, setBackground] = useState((localStorage.getItem('qr-code-background') || 'true') === 'true');
  const id = useMemo(() => base58.decode(base58Id), [base58Id]);
  const { isLoading, isError, data, error } = useQuery(['qrcode', slug, id], async () =>
    fetchQrCode({ id, type: slug }),
  );
  const shortName = isError ? '-' : `${typesMap[slug as TypesMapKeys]}${base58Id}`;

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
          downloadLink.download = `QRCode_${data?.value.name}`;
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
          <h2 style={{ color: isError ? 'var(--ion-color-danger, #f00)' : undefined }}>
            <>
              {isLoading && <IonSkeletonText animated style={{ width: '75%', height: '26px', margin: 'auto' }} />}
              {error ? serializeError(error) : data?.value.name}
            </>
          </h2>
          <div className={classes.qr_code_container}>
            <div style={{ margin: `${size / 16}px` }}>
              <QRCodeGenerator
                id="QRCode"
                value={`${QR_CODE_URL}/qr/${data?.type}/${base58Id}/`}
                size={size - size / 8}
                bgColor={background ? '#fff' : '#00000000'}
                fgColor={isLoading || isError ? '#fff' : undefined}
              />
            </div>
            <p style={{ margin: `${size / 16}px` }}>Valeur: {shortName}</p>
          </div>
        </div>

        <IonButton expand="block" onClick={onImageDownload} disabled={isLoading || isError}>
          Télécharger le QR Code
        </IonButton>
      </div>
    </Page>
  );
};

export default QrCode;
