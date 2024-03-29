import { FC, useState } from 'react';
import { IonInput, IonItem, IonNote, IonSpinner, useIonRouter } from '@ionic/react';
import { useFormik } from 'formik';
import { object, string } from 'yup';

import { serializeError } from '~/utils/errors';
import FormSubmitButton from '~/components/FormSubmitButton';
import Message from '~/components/Message';
import Page from '~/components/Page';
import RequiredAsterisk from '~/components/RequiredAsterisk';
import { useAuth } from '~/hooks/useAuth';
import classes from './Login.module.scss';

interface LoginFormValues {
  username: string;
  password: string;
}

const validationSchema = object({
  username: string().required('Le nom est requis'),
  password: string().required('Mot de passe requis'),
});

const Login: FC = () => {
  const { login } = useAuth();
  const router = useIonRouter();
  const initialValues: LoginFormValues = { username: '', password: '' };
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await login(values.username, values.password);
        setErrorMessage(undefined);
        resetForm({});
        router.push('/stock/');
      } catch (e) {
        setErrorMessage(serializeError(e));
        console.error(e);
      }
    },
  });
  return (
    <Page title="Connexion" hideLoginLogoutButton>
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <div className={classes.logo_container}>
          <img src="/assets/logo.svg" alt="logo" />
        </div>
        {errorMessage && (
          <Message color="danger" onDismiss={() => setErrorMessage(undefined)}>
            {errorMessage}
          </Message>
        )}
        <IonItem>
          <IonInput
            type="text"
            name="username"
            labelPlacement="stacked"
            value={formik.values.username}
            onIonChange={formik.handleChange}
            disabled={formik.isSubmitting}
          >
            <div slot="label">
              {/* TODO: ionic label slot still experimental ? */}
              Nom
              <RequiredAsterisk />
            </div>
          </IonInput>
        </IonItem>
        {formik.touched.username && Boolean(formik.errors.username) && (
          <IonNote color="danger">{formik.touched.username && formik.errors.username}</IonNote>
        )}
        <IonItem>
          <IonInput
            type="password"
            name="password"
            labelPlacement="stacked"
            value={formik.values.password}
            onIonChange={formik.handleChange}
            disabled={formik.isSubmitting}
          >
            <div slot="label">
              {/* TODO: ionic label slot still experimental */}
              Mot de passe
              <RequiredAsterisk />
            </div>
          </IonInput>
        </IonItem>
        {formik.touched.password && Boolean(formik.errors.password) && (
          <IonNote color="danger">{formik.touched.password && formik.errors.password}</IonNote>
        )}
        <FormSubmitButton disabled={formik.isSubmitting} expand="block">
          {formik.isSubmitting ? <IonSpinner /> : 'Se connecter'}
        </FormSubmitButton>
      </form>
    </Page>
  );
};

export default Login;
