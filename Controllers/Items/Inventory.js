import { Cards } from "../Cards.js";

const cards = Cards();

export default class Inventory {
  constructor() {
    var me = this;

    me.items = [];

  }

  addItem() {
    // var me = this,
    //   rndCardIndex = Math.floor(Math.random() * me.cardDrops.length),
    //   _card = new me.cardDrops[rndCardIndex]();

    // me.cards.push(_card);

    // _card.drawCard();

    // if (me.cards.length > 10) {
    //   let cardToRemove = me.cards[0];

    //   me.cards.splice(0, 1);

    //   cardToRemove.discard();
    // }
  }

  removeItem(card) {
    // var me = this,
    //   index = me.cards.indexOf(card);

    // me.cards.splice(index, 1);
  }

  discardItem(card) {
    // var me = this,
    //   index = me.cards.indexOf(card);

    // me.cards.splice(index, 1);
  }
}
