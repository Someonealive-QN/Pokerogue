import BattleScene from "../battle-scene";

export enum Setting {
  Game_Speed = "GAME_SPEED",
  Master_Volume = "MASTER_VOLUME",
  BGM_Volume = "BGM_VOLUME",
  SE_Volume = "SE_VOLUME",
  Show_Stats_on_Level_Up = "SHOW_LEVEL_UP_STATS"
}

export interface SettingOptions {
  [key: string]: string[]
}

export interface SettingDefaults {
  [key: string]: integer
}

export const settingOptions: SettingOptions = {
  [Setting.Game_Speed]: [ '1x', '1.25x', '1.5x', '2x', '2.5x', '3x', '4x', '5x' ],
  [Setting.Master_Volume]: new Array(11).fill(null).map((_, i) => i ? (i * 10).toString() : 'Mute'),
  [Setting.BGM_Volume]: new Array(11).fill(null).map((_, i) => i ? (i * 10).toString() : 'Mute'),
  [Setting.SE_Volume]: new Array(11).fill(null).map((_, i) => i ? (i * 10).toString() : 'Mute'),
  [Setting.Show_Stats_on_Level_Up]: [ 'Off', 'On' ]
};

export const settingDefaults: SettingDefaults = {
  [Setting.Game_Speed]: 0,
  [Setting.Master_Volume]: 5,
  [Setting.BGM_Volume]: 10,
  [Setting.SE_Volume]: 10,
  [Setting.Show_Stats_on_Level_Up]: 1
};

export function setSetting(scene: BattleScene, setting: Setting, value: integer): boolean {
  switch (setting) {
    case Setting.Game_Speed:
      scene.gameSpeed = parseFloat(settingOptions[setting][value].replace('x', ''));
      break;
    case Setting.Master_Volume:
      scene.masterVolume = value ? parseInt(settingOptions[setting][value]) * 0.01 : 0;
      scene.updateSoundVolume();
      break;
    case Setting.BGM_Volume:
      scene.bgmVolume = value ? parseInt(settingOptions[setting][value]) * 0.01 : 0;
      scene.updateSoundVolume();
      break;
    case Setting.SE_Volume:
      scene.seVolume = value ? parseInt(settingOptions[setting][value]) * 0.01 : 0;
      scene.updateSoundVolume();
      break;
    case Setting.Show_Stats_on_Level_Up:
      scene.showLevelUpStats = settingOptions[setting][value] === 'On';
      break;
  }

  return true;
}