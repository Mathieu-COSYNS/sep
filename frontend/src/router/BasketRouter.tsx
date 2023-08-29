import { FC, useEffect } from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { useQuery } from '@tanstack/react-query';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { saleApi } from '~/api/saleAPI';
import { useIdParam } from '~/hooks/useIdParam';
import Basket from '~/pages/Basket';
import { NotFound } from '~/pages/ErrorPages';
import Scanner from '~/pages/Scanner';
import { useBasketStore } from '~/store/basketStore';

export const BasketRouter: FC = () => {
  const { path } = useRouteMatch();
  const id = useIdParam();
  const { basket, reset, loadSale } = useBasketStore();

  const { data } = useQuery(['sale', id], async () => (id ? saleApi.fetchById(id) : null));

  useEffect(() => {
    if (!id || basket.id !== id) reset();
  }, [id, basket.id, reset]);

  useEffect(() => {
    if (data) loadSale(data);
  }, [data, loadSale]);

  return (
    <>
      <IonRouterOutlet>
        <Switch>
          <Route path={path} exact={true} strict={true}>
            <Basket />
          </Route>
          <Route path={`${path}scanner/`} exact={true} strict={true}>
            <Scanner />
          </Route>
          <Route exact={false} strict={false}>
            <NotFound />
          </Route>
        </Switch>
      </IonRouterOutlet>
    </>
  );
};
