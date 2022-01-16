import Mob from "./Mob.js";

export default class Slime extends Mob {
  constructor(tile) {
    super('Slime','mob-slime');

    var me = this;

    me.tile = tile;    
    me.expDrop = 15;
    me.cardDropChance = 50;
    me.itemDropChance = 50;
  }
}