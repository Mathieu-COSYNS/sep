import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { Plugin, ResolvedConfig } from 'vite';

export interface TransformManifestConfig {
  fileName?: string;
  extraContent?: object;
}

const defaultConfig: TransformManifestConfig = {
  fileName: 'manifest.webmanifest',
  extraContent: {},
};

export default function transformManifest(config?: TransformManifestConfig): Plugin {
  const transformManifestConfig = { ...defaultConfig, ...config };
  let viteConfig: ResolvedConfig;

  return {
    name: 'transform-manifest',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },
    async closeBundle() {
      if (viteConfig.command === 'serve') {
        return;
      }

      const originalPath = join(viteConfig.root, viteConfig.build.outDir, viteConfig.build.assetsDir);
      const file = `${originalPath}/${transformManifestConfig.fileName}`;

      const content = JSON.parse(await readFile(file, 'utf-8'));

      await writeFile(file, JSON.stringify({ ...content, ...transformManifestConfig.extraContent }));
    },
  };
}
