var _configs = {
  walkSpeed: 600,
  mobWalkSpeed: 1500,
  expMultiplier: 1.6,  
  lvlUpExpMultiplier: 1.6,  
};

export function Configs() {
  return _configs;
}

export function setConfigs(configs) {
  _configs = configs;
}
