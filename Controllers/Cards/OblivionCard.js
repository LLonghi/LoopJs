import Card from "./Card.js";

function destroyCards(card) {
  debugger
  //remover css dos tile
  //matar os monstros do tile
  //remover objetos (a fogueira nao!!)
}

export default class OblivionCard extends Card {
  constructor() {
    super('Oblivion','oblivion');    
    var me = this;
    
    me.cardType = 4;
    me.overrideTransformedTiles = true;
    me.transformTile = false;
    me.placementRules=[destroyCards]
  }  
}