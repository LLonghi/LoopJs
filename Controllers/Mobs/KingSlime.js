import Mob from "./Mob.js";

// Rei Slime: mob raro e poderoso, com grandes recompensas.
export default class KingSlime extends Mob {
  constructor(tile) {
    super("Rei Slime", "mob-slime mob-slime-king", {
      life: 70,
      attack: 12,
      defense: 5,
      attackSpeed: 1,
      variance: 0.15,
      expDrop: 80,
      cardDropChance: 100,
      itemDropChance: 100,
    });

    this.tile = tile;
  }
}
