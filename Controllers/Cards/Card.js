import { Configs } from "../Configs.js";

const configs = Configs();

let _cardId = 0;

function cardType(type) {
  var typeCircle = "";
  switch (type) {
    case 1:
      typeCircle =
        '<div class="card-model-circle card-model-circle-full"></div>';
      break;
    case 2:
      typeCircle =
        '<div class="card-model-circle card-model-circle-half"></div>';
      break;
    case 3:
      typeCircle = '<div class="card-model-circle"></div>';
      break;
    case 4:
      typeCircle =
        '<div class="card-model-circle card-model-circle-full"></div>' +
        '<div class="card-model-circle card-model-circle-half"></div>' +
        '<div class="card-model-circle"></div>';
      break;
  }

  return typeCircle;
}

function shuffleDeck() {}

function executePlacementRules(card){
  if(card.placementRules.length) card.placementRules.forEach(fn => fn(card));
};

export default class Card {
  constructor(cardName, cardClass) {
    var me = this;

    _cardId++;

    me.id = _cardId;
    me.cardEl = null;
    me.cardName = cardName;
    me.cardClass = cardClass;
    
    // 1 - road
    // 2 - roadside
    // 3 - landscape
    // 4 - special
    me.cardType = 0;
    me.goldenCard = false;

    me.placementRules = [];    
    me.overrideTransformedTiles = false;
    me.transformTile = true;

    me.tileCss = "";
    me.tileObject = null;
    me.tileFn = null;
    me.tilePlaced = null;
  }

  createCard() {
    var me = this;

    me.cardEl = $(
      `
      <div class="card ${me.goldenCard ? "card-golden" : ""}" data-card-id="${
        me.id
      }" data-card-type="${me.cardType}" data-card="${
        me.cardClass
      }" data-override="${me.overrideTransformedTiles}">
          <div class="card-model">
             ${cardType(me.cardType)}
          </div>
          <div class="card-image"></div>
          <div class="card-name-cnt">
            <div class="card-name-cnt-content">
              <span class="card-name">${me.cardName}</span>
            </div>
          </div>
          <div class="card-line"></div>
        </div>
        `
    );
  }

  drawCard() {
    var me = this;

    me.createCard();

    controllers.Elements.cardBox.append(me.cardEl);

    me.cardEl.animate;

    // setTimeout(() => {
    //   me.cardEl.addClass("card-add-animation");
    // }, 2000);

    me.cardEl[0].animate(
      [
        // keyframes
        { transform: "translateX(50px)", opacity: 0 },
        { transform: "translateX(0px)", opacity: 1 },
      ],
      {
        // timing options
        duration: 400,
      }
    );

    autoSizeTextElement(me.cardEl.find(".card-name")[0]);

    me.cardEl.bind({
      mousedown: dragDropFN.mousedown,
      obj: me,
    });

    var sfx = new Audio("/Assets/sound/card_new.wav");
    sfx.volume = configs.sfxVolume;
    sfx.play();
  }

  place(tile) {
    var me = this;

    window.globalEnv.cardHand.removeCard(me);

    if (me.transformTile) tile.tileTransformed = true;

    if (me.tileCss) tile.el.addClass(me.tileCss);

    if (me.tileObject)
      tile.el.append(`<div style="color: wheat;">${me.tileObject}</div>`);

    if (me.tileFn) me.tileFn();

    //temporario para ver oq foi inserido
    if (!me.tileCss && !me.tileObject && !me.tileCss)
      tile.el.append(`<div style="color: wheat;">${me.cardName}</div>`);

    me.tilePlaced = tile;    

    var sfx = new Audio("/Assets/sound/card_place.mp3");
    sfx.volume = configs.sfxVolume;
    sfx.play();

    me.cardEl.addClass("card-hidden");

    setTimeout(() => {
      me.cardEl[0].animate([{ width: "0px" }], {
        duration: 250,
      });

      setTimeout(() => {
        me.cardEl.remove();
      }, 251);
    }, 401);

    executePlacementRules(me);    
  }

  discard() {
    const me = this;

    console.log('removing this card', me)
    
    window.globalEnv.cardHand.removeCard(me);

    var sfx = new Audio("/Assets/sound/card_burn.mp3");
    sfx.volume = configs.sfxVolume;
    sfx.play();

    me.cardEl[0].animate(
      [
        { transform: "translateY(0px)", opacity: 1 },
        { transform: "translateY(-200px)", opacity: 0 },
      ],
      {
        duration: 400,
      }
    );

    me.cardEl.addClass("card-hidden");

    setTimeout(() => {
      me.cardEl[0].animate([{ width: "0px" }], {
        duration: 250,
      });

      setTimeout(() => {
        me.cardEl.remove();
        console.log(me.cardEl)
      }, 251);
    }, 401);
  }
}
