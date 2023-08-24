import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from './hooks';
import { RootState } from './store';

interface Banner {
  id: string;
  message?: string;
  explanation?: string;
  type: 'success' | 'warning' | 'error';
}

type BannerState = Banner[];

const initialState: BannerState = [];

export const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    addOfflineBanner: (state) => {
      const offlineBanner: Banner = {
        id: 'offline',
        message: 'Aucune connexion',
        explanation:
          'Nous ne détectons pas de connexion à internet. Vérifiez votre connexion dans les paramètres de votre appareil.',
        type: 'error',
      };
      return [offlineBanner, ...state.filter((value) => value.id != 'offline')];
    },
    removeOfflineBanner: (state) => {
      return state.filter((value) => value.id != 'offline');
    },
    addUpdateAvailableBanner: (state) => {
      const updateAvailableBanner: Banner = {
        id: 'updateAvailable',
        message: 'Mise à jour disponible',
        explanation:
          "Une mise à jour est disponible. Veuillez fermer l'application ou toutes les fenêtres du navigateur dans lesquelles l'application est ouverte. La prochaine fois que vous ouvrirez l'application, elle sera à jour.",
        type: 'warning',
      };
      return [...state.filter((value) => value.id != 'updateAvailable'), updateAvailableBanner];
    },
    removeUpdateAvailableBanner: (state) => {
      return state.filter((value) => value.id != 'updateAvailable');
    },
  },
});

export const { addOfflineBanner, removeOfflineBanner, addUpdateAvailableBanner, removeUpdateAvailableBanner } =
  bannerSlice.actions;

export const selectBanner = (state: RootState): BannerState => state.banner;

export const useBanner = (): BannerState => useAppSelector(selectBanner);

export const getBannerColor = (banner: BannerState): string => {
  if (banner.length != 0) {
    switch (banner[0].type) {
      case 'success':
        return '--ion-color-success-flash';
      case 'warning':
        return '--ion-color-warning-flash';
      case 'error':
        return '--ion-color-danger-flash';
    }
  }
  return '';
};

export default bannerSlice.reducer;
