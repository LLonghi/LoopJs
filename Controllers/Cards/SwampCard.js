import Card from "./Card.js";

export default class SwampCard extends Card {
  constructor() {
    super('Swamp','swamp');    
    var me = this;
    
    me.cardType = 1;
    me.tileCss = 'tile-swamp';
  }
}