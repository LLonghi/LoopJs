import Card from "./Card.js";

export default class OblivionCard extends Card {
  constructor() {
    super('Oblivion','oblivion');    
    var me = this;
    
    me.cardType = 4;
    me.overrideTransformedTiles = true;
    me.transformTile = false;
  }
}