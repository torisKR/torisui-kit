import manifest from '../../../packages/ui/package.json';

export const packageVersion = manifest.version;
export const installCommand = `npm install ${manifest.name}@^${packageVersion}`;
