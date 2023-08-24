import { create } from 'zustand';

interface Banner {
  id: string;
  message?: string;
  explanation?: string;
  type: 'success' | 'warning' | 'error';
}

interface ColoredBanner extends Banner {
  backgroundColor: string;
}

interface BannerStore {
  banners: Banner[];
  getBanner: () => ColoredBanner | null;
  addOfflineBanner: () => void;
  removeOfflineBanner: () => void;
  addUpdateAvailableBanner: () => void;
  removeUpdateAvailableBanner: () => void;
}

const getBannerBackgroundColor = (banner: Banner): string => {
  switch (banner.type) {
    case 'success':
      return 'var(--ion-color-success-flash)';
    case 'warning':
      return 'var(--ion-color-warning-flash)';
    case 'error':
      return 'var(--ion-color-danger-flash)';
  }
};

export const useBannerStore = create<BannerStore>((set, get) => ({
  banners: [],
  getBanner: () => {
    const { banners } = get();
    if (banners.length === 0) return null;
    return { ...banners[0], backgroundColor: getBannerBackgroundColor(banners[0]) };
  },
  addOfflineBanner: () =>
    set(({ banners }) => {
      if (banners.find((value) => value.id === 'offline')) return {};
      const offlineBanner: Banner = {
        id: 'offline',
        message: 'Aucune connexion',
        explanation:
          'Nous ne détectons pas de connexion à internet. Vérifiez votre connexion dans les paramètres de votre appareil.',
        type: 'error',
      };
      return { banners: [offlineBanner, ...banners] };
    }),
  removeOfflineBanner: () =>
    set(({ banners }) => {
      return { banners: banners.filter((value) => value.id != 'offline') };
    }),
  addUpdateAvailableBanner: () =>
    set(({ banners }) => {
      if (banners.find((value) => value.id === 'updateAvailable')) return {};
      const updateAvailableBanner: Banner = {
        id: 'updateAvailable',
        message: 'Mise à jour disponible',
        explanation:
          "Une mise à jour est disponible. Veuillez fermer l'application ou toutes les fenêtres du navigateur dans lesquelles l'application est ouverte. La prochaine fois que vous ouvrirez l'application, elle sera à jour.",
        type: 'warning',
      };
      return { banners: [...banners, updateAvailableBanner] };
    }),
  removeUpdateAvailableBanner: () =>
    set(({ banners }) => {
      return { banners: banners.filter((value) => value.id != 'updateAvailable') };
    }),
}));
