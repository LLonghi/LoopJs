import { World } from "./Controllers/World.js";
import { Stats } from "./Controllers/Stats.js";
import { Elements } from "./Controllers/Elements.js";
import { Configs } from "./Controllers/Configs.js";
import { Mobs } from "./Controllers/Mobs.js";
import { PathCreator } from "./Controllers/PathCreator.js";
import CardHand from "./Controllers/Cards/CardHand.js";
import Inventory from "./Controllers/Items/Inventory.js";

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
  cardHand: new CardHand(),
  inventory: new Inventory()
};

controllers.World.play();

setTimeout(() => {
  window.themeSong = new Audio("/Assets/sound/theme.mp3");
  window.themeSong.loop = true;
  window.themeSong.volume = controllers.Configs.themeVolume;
  window.themeSong.muted = true;
  window.themeSong.autoplay = true;
  window.themeSong.play();
}, 1300);

document.body.addEventListener("mousemove", function () {
  if (window.themeSong) window.themeSong.muted = false;
  //
});
