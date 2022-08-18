import { FC, ReactNode } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { LocationDescriptor } from 'history';
import { Unauthorized } from 'pages/ErrorPages';

export interface RestrictedRouteProps extends RouteProps {
  children: ReactNode;
  canAccess: boolean;
  redirectTo?: LocationDescriptor;
}

const RestrictedRoute: FC<RestrictedRouteProps> = ({ children, canAccess, redirectTo, ...props }) => {
  const check = () => (canAccess ? children : redirectTo ? <Redirect to={redirectTo} /> : <Unauthorized />);
  return <Route {...props} render={check} />;
};

export default RestrictedRoute;
