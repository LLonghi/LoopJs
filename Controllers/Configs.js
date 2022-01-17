var _configs = {
  walkSpeed: 600,
  mobWalkSpeed: 1500,
  expMultiplier: 1.6,  
  lvlUpExpMultiplier: 1.6,  
  sfxVolume: 0.1,
  themeVolume: 0.1
};

export function Configs() {
  return _configs;
}

export function setConfigs(configs) {
  _configs = configs;
}
