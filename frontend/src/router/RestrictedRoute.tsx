import { FC, ReactNode } from 'react';
import { LocationDescriptor } from 'history';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuth } from '~/hooks/useAuth';
import { Unauthorized } from '~/pages/ErrorPages';

export enum AccessLevel {
  ANONYMOUS,
  AUTHENTICATED,
}
export interface RestrictedRouteProps extends RouteProps {
  children: ReactNode;
  accessLevel: AccessLevel;
  redirectTo?: LocationDescriptor;
}

const RestrictedRoute: FC<RestrictedRouteProps> = ({ children, accessLevel, redirectTo, ...props }) => {
  const { user } = useAuth();
  let canAccess = false;
  switch (accessLevel) {
    case AccessLevel.ANONYMOUS:
      canAccess = !user;
      break;
    case AccessLevel.AUTHENTICATED:
      canAccess = !!user;
      break;
  }
  const check = () => (canAccess ? children : redirectTo ? <Redirect to={redirectTo} /> : <Unauthorized />);
  return <Route {...props} render={check} />;
};

export default RestrictedRoute;
