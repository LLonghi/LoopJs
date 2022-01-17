import Card from "./Card.js";

export default class ArsenalCard extends Card {
  constructor() {
    super('Arsenal','arsenal');    
    var me = this;
    
    me.cardType = 2;
    me.goldenCard = true;
  }
}