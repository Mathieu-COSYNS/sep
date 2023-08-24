import { FC, Fragment } from 'react';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';
import {
  cartOutline,
  cartSharp,
  cogOutline,
  cogSharp,
  cubeOutline,
  cubeSharp,
  fileTrayFullSharp,
  fileTrayOutline,
  fileTrayStackedOutline,
  fileTrayStackedSharp,
  logInOutline,
  logInSharp,
  openOutline,
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

import environment from '~/environment';
import { useUser } from '~/redux/userSlice';
import classes from './Menu.module.scss';
import Version from './Version';

interface MenuEntry {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  separatorBefore?: boolean;
  external?: boolean;
}

const anonPages: MenuEntry[] = [
  {
    title: 'Se Connecter',
    url: '/connexion/',
    iosIcon: logInOutline,
    mdIcon: logInSharp,
  },
];

const userPages: MenuEntry[] = [
  {
    title: 'Stock',
    url: '/stock/',
    iosIcon: fileTrayStackedOutline,
    mdIcon: fileTrayStackedSharp,
  },
  {
    title: 'Packs',
    url: '/packs/',
    iosIcon: cubeOutline,
    mdIcon: cubeSharp,
  },
  {
    title: 'Ventes',
    url: '/ventes/',
    iosIcon: cartOutline,
    mdIcon: cartSharp,
  },
  {
    title: 'Entrées',
    url: '/entrees/',
    iosIcon: fileTrayOutline,
    mdIcon: fileTrayFullSharp,
  },
  {
    title: 'Admin Panel',
    url: '/admin/',
    iosIcon: cogOutline,
    mdIcon: cogSharp,
    separatorBefore: true,
    external: true,
  },
];

const Menu: FC = () => {
  const location = useLocation();
  const user = useUser();

  const pages = user.data ? userPages : anonPages;

  return (
    <IonMenu contentId="main" type="overlay" className={classes.menu}>
      <IonContent>
        <IonList>
          {user.data && (
            <>
              <div className={classes.user_box}>
                <IonNote>
                  Bonjour, <strong>{user.data.name}</strong>
                </IonNote>
              </div>
              <hr />
            </>
          )}
          <div className={classes.brand_box}>
            {environment.APP_SHORT_NAME ? (
              <>
                <IonListHeader>{environment.APP_SHORT_NAME}</IonListHeader>
                <IonNote>{environment.APP_NAME}</IonNote>
              </>
            ) : (
              <IonListHeader>{environment.APP_NAME}</IonListHeader>
            )}
          </div>
          <hr />
          {pages.map((menuEntry) => {
            return (
              <Fragment key={menuEntry.url}>
                {menuEntry.separatorBefore && <hr />}
                <IonMenuToggle autoHide={false}>
                  <IonItem
                    className={location.pathname === menuEntry.url ? classes.selected : undefined}
                    href={menuEntry.url}
                    routerLink={!menuEntry.external ? menuEntry.url : undefined}
                    routerDirection="none"
                    lines="none"
                    detail={false}
                  >
                    <IonIcon slot="start" ios={menuEntry.iosIcon} md={menuEntry.mdIcon} aria-hidden />
                    <IonLabel>{menuEntry.title}</IonLabel>
                    {menuEntry.external && (
                      <IonIcon slot="end" ios={openOutline} md={openOutline} aria-label="Lien externe" />
                    )}
                  </IonItem>
                </IonMenuToggle>
              </Fragment>
            );
          })}
          <hr />
          <IonNote className={classes.version_box}>
            <Version />
          </IonNote>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
