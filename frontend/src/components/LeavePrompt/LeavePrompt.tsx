import { FC } from 'react';
import { Prompt } from 'react-router';
import { useBeforeUnload } from 'react-use';

import { useIsBasketDirty } from '~/redux/basketSlice';

const LeavePrompt: FC = () => {
  const basketDirty = useIsBasketDirty();
  const text = basketDirty
    ? 'Êtes-vous sûr de vouloir quittez la page ? Les données du pannier ne seront pas sauvegardées.'
    : undefined;

  useBeforeUnload(!!text, text);

  return (
    <Prompt
      when={!!text}
      message={(location) => {
        if (location.pathname === '/ventes/pannier/' || location.pathname === '/ventes/scanner/') return true;
        return text || '';
      }}
    />
  );
};

export default LeavePrompt;
