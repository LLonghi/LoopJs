import Mob from "./Mob.js";

// Lobo: rápido e agressivo, porém com pouca vida e defesa.
export default class Wolf extends Mob {
  constructor(tile) {
    super("Lobo", "mob-wolf", {
      life: 22,
      attack: 10,
      defense: 1,
      attackSpeed: 1.6,
      variance: 0.2,
      expDrop: 28,
      cardDropChance: 60,
      itemDropChance: 55,
    });

    this.tile = tile;
  }
}
