import { FC } from 'react';

import ErrorPage from './ErrorPage';

const NotFoundPage: FC = () => {
  return (
    <ErrorPage
      title="404 Non trouvée"
      code={404}
      explanation="La page que vous recherchez n'existe pas ou a été supprimée"
    />
  );
};

export default NotFoundPage;
