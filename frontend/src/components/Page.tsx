import { ReactNode, useEffect, useRef } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { logInOutline, logInSharp, logOutOutline, logOutSharp } from 'ionicons/icons';
import { useParams } from 'react-router-dom';

import { useAuth } from '~/hooks/useAuth';
import classes from './Page.module.scss';

export interface PageProps {
  title: string;
  backButton?: boolean;
  defaultBackUrl?: string;
  backText?: string;
  headerEndButtons?: ReactNode;
  hideLoginLogoutButton?: boolean;
  children: ReactNode;
}

const Page: React.FC<PageProps> = ({
  title,
  backButton = false,
  defaultBackUrl = '/',
  backText,
  hideLoginLogoutButton = false,
  children,
}) => {
  const ionContentRef = useRef<HTMLIonContentElement>(null);
  const { name } = useParams<{ name: string }>();
  const { user, logout } = useAuth();
  const router = useIonRouter();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
main > slot{
  display: flex;
  flex-direction: column;
  min-height: 100%;
}`;

    ionContentRef.current?.shadowRoot?.appendChild(style);
  }, []);

  const handleLogoutClick = () => {
    logout();
    router.push('/connexion/');
  };

  if (!title) title = name;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {backButton ? (
              <>
                <IonBackButton className="ios-only" defaultHref={defaultBackUrl} text={backText} />
                <IonBackButton className="md-only" defaultHref={defaultBackUrl} />
              </>
            ) : (
              <IonMenuButton />
            )}
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          {!hideLoginLogoutButton && (
            <IonButtons slot="end">
              {user ? (
                <IonButton
                  fill="clear"
                  size="small"
                  shape="round"
                  className={classes.logout}
                  onClick={handleLogoutClick}
                >
                  <span>Se déconnecter</span>
                  <IonIcon slot="end" ios={logOutOutline} md={logOutSharp} aria-hidden />
                </IonButton>
              ) : (
                <IonButton fill="clear" size="small" shape="round" className={classes.logout} routerLink="/connexion/">
                  <span>Se Connecter</span>
                  <IonIcon slot="end" ios={logInOutline} md={logInSharp} aria-hidden />
                </IonButton>
              )}
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent ref={ionContentRef}>
        {/* <IonHeader>
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader> */}
        {children}
      </IonContent>
    </IonPage>
  );
};

export default Page;
