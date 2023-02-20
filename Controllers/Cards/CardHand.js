import { Cards } from "../Cards.js";

const cards = Cards();

export default class CardHand {
  constructor() {
    var me = this;

    me.cards = [];
    me.goldenCards = [cards.ArsenalCard];
    me.deck = [];
    me.cardDrops = [
      cards.MountainCard,
      cards.GrooveCard,
      cards.SpiderCocoonCard,
      cards.SwampCard,
      cards.OblivionCard,
    ];

    console.log("Todo: create deck");
  }

  addCard() {
    var me = this,
      rndCardIndex = Math.floor(Math.random() * me.cardDrops.length),
      _card = new me.cardDrops[rndCardIndex]();

    me.cards.push(_card);

    _card.drawCard();

    if (me.cards.length > 10) {
      let cardToRemove = me.cards[0];
      cardToRemove.discard();
    }
  }

  addGoldenCard() {
    var me = this,
      _card = new me.goldenCards[0]();

    me.cards.push(_card);

    _card.drawCard();

    if (me.cards.length > 10) {
      let cardToRemove = me.cards[0];

      me.cards.splice(0, 1);

      cardToRemove.discard();
    }
  }

  placeCard(cardId, tileCoord) {
    let _card = globalEnv.cardHand.cards.find((c) => c.id == cardId),
      coord = tileCoord.split("-"),
      _tile = controllers.World.getTile(coord[0], coord[1]);

    _card.place(_tile);
  }

  removeCard(card) {
    var me = this,
      index = me.cards.indexOf(card);

    me.cards.splice(index, 1);
  }
}
