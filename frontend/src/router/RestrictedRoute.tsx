import { FC, ReactNode } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { LocationDescriptor } from 'history';
import { Unauthorized } from '@/pages/ErrorPages';
import { useUser } from '@/redux/userSlice';

export enum AccessLevel {
  ANONYM,
  AUTHENTICATED,
}
export interface RestrictedRouteProps extends RouteProps {
  children: ReactNode;
  accessLevel: AccessLevel;
  redirectTo?: LocationDescriptor;
}

const RestrictedRoute: FC<RestrictedRouteProps> = ({ children, accessLevel, redirectTo, ...props }) => {
  const user = useUser();
  let canAccess = false;
  switch (accessLevel) {
    case AccessLevel.ANONYM:
      canAccess = !user.data;
      break;
    case AccessLevel.AUTHENTICATED:
      canAccess = !!user.data;
      break;
  }
  const check = () => (canAccess ? children : redirectTo ? <Redirect to={redirectTo} /> : <Unauthorized />);
  return <Route {...props} render={check} />;
};

export default RestrictedRoute;
