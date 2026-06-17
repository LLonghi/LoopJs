import Mob from "./Mob.js";

// Slime tóxico: mais agressivo, mas frágil.
export default class ToxicSlime extends Mob {
  constructor(tile) {
    super("Slime Tóxico", "mob-slime mob-slime-toxic", {
      life: 16,
      attack: 9,
      defense: 0,
      attackSpeed: 1,
      variance: 0.25,
      expDrop: 22,
      cardDropChance: 55,
      itemDropChance: 55,
    });

    this.tile = tile;
  }
}
