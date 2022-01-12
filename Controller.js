import { World } from "./Controllers/World.js";
import { Stats } from "./Controllers/Stats.js";
import { Elements} from "./Controllers/Elements.js";
import { Configs } from "./Controllers/Configs.js";
import { Hero } from "./Controllers/Hero.js";
import { Mobs } from"./Controllers/Mobs.js";
import { PathCreator } from"./Controllers/PathCreator.js";

const controllers = {
  World: World(),
  Stats: Stats(),
  Hero: Hero(),
  Configs: Configs(),
  Elements: Elements(),
  Mobs: Mobs(),
  PathCreator: PathCreator(),
};

window.controllers = controllers;


controllers.World.play();

