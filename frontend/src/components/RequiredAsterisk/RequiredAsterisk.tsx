import { FC } from 'react';

import classes from './RequiredAsterisk.module.scss';

const RequiredAsterisk: FC = () => {
  return <span className={`${classes.required_asterisk}`}>*</span>;
};

export default RequiredAsterisk;
