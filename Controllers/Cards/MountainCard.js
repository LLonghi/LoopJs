import Card from "./Card.js";

export default class MountainCard extends Card {
  constructor() {
    super('Mountain','mountain');    
    var me = this;
    
    me.cardType = 3;
  }
}