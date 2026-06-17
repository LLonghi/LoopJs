import Mob from "./Mob.js";

export default class Slime extends Mob {
  constructor(tile) {
    super("Slime", "mob-slime", {
      life: 18,
      attack: 5,
      defense: 1,
      attackSpeed: 1,
      variance: 0.25,
      expDrop: 15,
      cardDropChance: 50,
      itemDropChance: 50,
    });

    this.tile = tile;
  }
}
