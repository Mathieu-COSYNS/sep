import { IonButton } from '@ionic/react';
import { FC } from 'react';

const FormSubmitButton: FC<(typeof IonButton)['defaultProps']> = (props) => {
  return (
    <>
      <input type="submit" style={{ visibility: 'hidden', position: 'absolute', left: '-1000px' }} />
      <IonButton type="submit" {...props} />
    </>
  );
};

export default FormSubmitButton;
