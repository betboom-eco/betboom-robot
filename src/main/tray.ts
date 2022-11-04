import { Tray, nativeImage, Menu, app } from 'electron';
import path from 'path';
import config from '../config';

const EXTRA_RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (resourceFilename: string): string => {
  return path.join(EXTRA_RESOURCES_PATH, resourceFilename);
};

export default function buildTray() {
  const icon = nativeImage
    .createFromPath(getAssetPath('32x32.png'))
    .resize({ width: 22, height: 22 });

  const tray = new Tray(icon);
  const ctxMenu = Menu.buildFromTemplate([
    {
      label: `Quit ${config.brand}`,
      type: 'normal',
      click() {
        app.exit(-1);
      },
    },
  ]);
  tray.setContextMenu(ctxMenu);
  return tray;
}
