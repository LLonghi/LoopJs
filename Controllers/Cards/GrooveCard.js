import Card from "./Card.js";

export default class GrooveCard extends Card {
  constructor() {
    super('Groove','groove');    
    var me = this;

    me.cardType = 3;
  }
}