import Mob from "./Mob.js";

// Slime de magma: equilibrado e perigoso, com bom ataque e vida.
export default class MagmaSlime extends Mob {
  constructor(tile) {
    super("Slime de Magma", "mob-slime mob-slime-magma", {
      life: 26,
      attack: 8,
      defense: 2,
      attackSpeed: 1.1,
      variance: 0.22,
      expDrop: 30,
      cardDropChance: 60,
      itemDropChance: 60,
    });

    this.tile = tile;
  }
}
