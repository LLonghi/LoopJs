import { World } from "./Controllers/World.js";
import { Stats } from "./Controllers/Stats.js";
import { Elements } from "./Controllers/Elements.js";
import { Configs } from "./Controllers/Configs.js";
import { Mobs } from "./Controllers/Mobs.js";
import { PathCreator } from "./Controllers/PathCreator.js";

const controllers = {
  World: World(),
  Stats: Stats(),
  Configs: Configs(),
  Elements: Elements(),
  Mobs: Mobs(),
  PathCreator: PathCreator(),
};

window.controllers = controllers;

window.globalEnv = {
  hero: null,
  tiles: null,
  cardHand: []
};

controllers.World.play();

// setTimeout(() => {
//   new Audio('/Assets/sound/theme.mp3').play()
// }, 1000);
