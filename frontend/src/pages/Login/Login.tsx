import Page from 'components/Page';
import { useState, VFC } from 'react';
import { useFormik } from 'formik';
import { IonInput, IonItem, IonLabel, IonNote, IonSpinner, useIonRouter } from '@ionic/react';
import classes from './Login.module.scss';
import * as yup from 'yup';
import { loginUser } from 'api/userAPI';
import FormSubmitButton from 'components/FormSubmitButton';
import Message from 'components/Message';
import { useAppDispatch } from 'redux/hooks';
import { login } from 'redux/userSlice';
import { isRequestStatusError } from 'types/RequestStatusError';
import RequiredAsterisk from 'components/RequiredAsterisk';

interface LoginFormValues {
  username: string;
  password: string;
}

const validationSchema = yup.object({
  username: yup.string().required('Le nom est requis'),
  password: yup.string().required('Mot de passe requis'),
});

const Login: VFC = () => {
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  const initialValues: LoginFormValues = { username: '', password: '' };
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await loginUser(values.username, values.password);
        setErrorMessage(undefined);
        dispatch(login(result));
        router.push('/stock/');
      } catch (e) {
        if (isRequestStatusError(e)) {
          setErrorMessage(e.message);
        } else {
          setErrorMessage(e.toString());
        }
        console.error(e);
      }
    },
  });
  return (
    <Page title="Connexion">
      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <div className={classes.logo_container}>
          <img src="/assets/icon/sep.svg" alt="logo" />
        </div>
        {errorMessage && (
          <Message color="danger" onDismiss={() => setErrorMessage(undefined)}>
            {errorMessage}
          </Message>
        )}
        <IonItem>
          <IonLabel position="stacked">
            Nom
            <RequiredAsterisk />
          </IonLabel>
          <IonInput
            type="text"
            name="username"
            value={formik.values.username}
            onIonChange={formik.handleChange}
            disabled={formik.isSubmitting}
          />
        </IonItem>
        {formik.touched.username && Boolean(formik.errors.username) && (
          <IonNote color="danger">{formik.touched.username && formik.errors.username}</IonNote>
        )}
        <IonItem>
          <IonLabel position="stacked">
            Mot de passe
            <RequiredAsterisk />
          </IonLabel>
          <IonInput
            type="password"
            name="password"
            value={formik.values.password}
            onIonChange={formik.handleChange}
            disabled={formik.isSubmitting}
          />
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
