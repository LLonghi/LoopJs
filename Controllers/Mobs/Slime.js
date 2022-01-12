import Mob from "./Mob.js";

export default class Slime extends Mob {
  constructor(tile) {
    super('Slime','mob-slime');
    this.tile = tile;
  }
}