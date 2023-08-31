import { join } from 'path';
import sharp from 'sharp';
import { Plugin, ResolvedConfig } from 'vite';

export interface TransformLogoConfig {
  logo?: string;
  backgroundColor?: string;
  namePrefix?: string;
  sizes?: number[];
  circleRadius?: number;
}

const defaults = {
  backgroundColor: '#fff',
  namePrefix: 'pwa-maskable-',
  sizes: [36, 48, 72, 96, 144, 192, 256, 384, 512],
  circleRadius: 4 / 5, // @see https://w3c.github.io/manifest/#icon-masks to why 4/5
};

export default function transformLogo(config: TransformLogoConfig): Plugin {
  const _config = { ...defaults, ...config };
  let viteConfig: ResolvedConfig;

  return {
    name: 'transform-logo',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;

      if (!config.logo || config.logo === '') {
        _config.logo = join(viteConfig.root, 'src', 'logo.png');
      }
    },
    async closeBundle() {
      if (viteConfig.command === 'serve') {
        return;
      }

      const outputPath = join(viteConfig.root, viteConfig.build.outDir, viteConfig.build.assetsDir);

      for (const size of _config.sizes) {
        const safeSize = Math.floor(size * _config.circleRadius);
        const icon = await sharp(_config.logo).resize(safeSize, safeSize).toBuffer();
        await sharp({
          create: {
            width: size,
            height: size,
            channels: 3,
            background: _config.backgroundColor,
          },
        })
          .composite([{ input: icon }])
          .png()
          .toFile(join(outputPath, `${_config.namePrefix}${size}x${size}.png`));
      }
    },
  };
}
