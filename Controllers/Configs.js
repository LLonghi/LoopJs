// Velocidades-base (1x). O multiplicador divide esses valores para acelerar.
const _baseSpeeds = {
  walkSpeed: 600,
  mobWalkSpeed: 1500,
};

var _configs = {
  walkSpeed: _baseSpeeds.walkSpeed,
  mobWalkSpeed: _baseSpeeds.mobWalkSpeed,
  speedMultiplier: 1,
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

// Ajusta a velocidade do jogo em tempo real (ex.: 1, 2, 4...).
// Muta o objeto de config existente para que os módulos que já o referenciam
// (World, Hero, Mob) usem o novo valor imediatamente.
export function setSpeedMultiplier(multiplier) {
  const safe = multiplier > 0 ? multiplier : 1;
  _configs.speedMultiplier = safe;
  _configs.walkSpeed = Math.round(_baseSpeeds.walkSpeed / safe);
  _configs.mobWalkSpeed = Math.round(_baseSpeeds.mobWalkSpeed / safe);
  return _configs.speedMultiplier;
}
