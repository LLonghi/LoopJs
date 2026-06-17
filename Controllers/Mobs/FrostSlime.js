import Mob from "./Mob.js";

// Slime gélido: muita vida e defesa, ataque baixo.
export default class FrostSlime extends Mob {
  constructor(tile) {
    super("Slime Gélido", "mob-slime mob-slime-frost", {
      life: 34,
      attack: 4,
      defense: 4,
      attackSpeed: 0.8,
      variance: 0.2,
      expDrop: 26,
      cardDropChance: 55,
      itemDropChance: 60,
    });

    this.tile = tile;
  }
}
