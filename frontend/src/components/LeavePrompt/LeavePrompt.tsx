import { FC } from 'react';
import { Prompt, useLocation } from 'react-router';
import { useBeforeUnload } from 'react-use';

import { useIsBasketDirty } from '~/store/basketStore';

const basketLocations = RegExp(/^\/ventes\/(ajouter|\d+)\//);

const LeavePrompt: FC = () => {
  const basketDirty = useIsBasketDirty();
  const location = useLocation();
  const text =
    basketDirty && location.pathname.match(basketLocations)
      ? 'Êtes-vous sûr de vouloir quittez la page ? Les données du pannier ne seront pas sauvegardées.'
      : undefined;

  useBeforeUnload(!!text, text);

  return (
    <Prompt
      when={!!text}
      message={(location) => {
        if (location.pathname.match(basketLocations)) return true;
        return text || '';
      }}
    />
  );
};

export default LeavePrompt;
