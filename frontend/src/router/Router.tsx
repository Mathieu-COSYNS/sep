import { FC, useRef, useState } from 'react';
import { IonAlert, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import LeavePrompt from '~/components/LeavePrompt';
import Menu from '~/components/Menu';
import { useAuth } from '~/hooks/useAuth';
import Entries from '~/pages/Entries';
import { NotFound } from '~/pages/ErrorPages';
import Login from '~/pages/Login';
import Packs from '~/pages/Packs';
import QrCode from '~/pages/QrCode';
import Sales from '~/pages/Sales';
import Stock from '~/pages/Stock/Stock';
import { BasketRouter } from './BasketRouter';
import RestrictedRoute, { AccessLevel } from './RestrictedRoute';

const Router: FC = () => {
  const { user } = useAuth();
  const [leaveConfirmMessage, setLeaveConfirmMessage] = useState<string>();
  const confirmCallback = useRef<(ok: boolean) => void>();

  return (
    <IonReactRouter
      getUserConfirmation={(message, callback) => {
        setLeaveConfirmMessage(message);
        confirmCallback.current = callback;
      }}
    >
      <IonSplitPane contentId="main">
        <Menu />
        <IonRouterOutlet id="main">
          <Switch>
            <RestrictedRoute
              path="/qr/:slug(product|pack)/:base58Id/"
              accessLevel={AccessLevel.AUTHENTICATED}
              exact={true}
              strict={true}
            >
              <QrCode />
            </RestrictedRoute>
            <RestrictedRoute
              path="/connexion/"
              accessLevel={AccessLevel.ANONYMOUS}
              redirectTo="/stock/"
              exact={true}
              strict={true}
            >
              <Login />
            </RestrictedRoute>
            <RestrictedRoute path="/stock/" accessLevel={AccessLevel.AUTHENTICATED} exact={true} strict={true}>
              <Stock />
            </RestrictedRoute>
            <RestrictedRoute path="/packs/" accessLevel={AccessLevel.AUTHENTICATED} exact={true} strict={true}>
              <Packs />
            </RestrictedRoute>
            <RestrictedRoute path="/ventes/" accessLevel={AccessLevel.AUTHENTICATED} exact={true} strict={true}>
              <Sales />
            </RestrictedRoute>
            <RestrictedRoute path="/ventes/:id(ajouter|\d+)/" accessLevel={AccessLevel.AUTHENTICATED} strict={true}>
              <BasketRouter />
            </RestrictedRoute>
            <RestrictedRoute path="/entrees/" accessLevel={AccessLevel.AUTHENTICATED} exact={true} strict={true}>
              <Entries />
            </RestrictedRoute>
            <Route
              path="/"
              exact={true}
              strict={false}
              render={() => (user ? <Redirect to="/stock/" /> : <Redirect to="/connexion/" />)}
            />
            <Route exact={false} strict={false}>
              <NotFound />
            </Route>
          </Switch>
        </IonRouterOutlet>
      </IonSplitPane>
      <IonAlert
        isOpen={!!leaveConfirmMessage}
        message={leaveConfirmMessage}
        buttons={[
          {
            text: 'Non',
            role: 'cancel',
            handler: () => {
              confirmCallback.current && confirmCallback.current(false);
            },
          },
          {
            text: 'Oui, quitter la page',
            role: 'destructive',
            handler: () => {
              confirmCallback.current && confirmCallback.current(true);
            },
          },
        ]}
        onDidDismiss={() => setLeaveConfirmMessage(undefined)}
      />
      <LeavePrompt />
    </IonReactRouter>
  );
};

export default Router;
