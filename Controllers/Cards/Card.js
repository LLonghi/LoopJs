export default class Card {
  constructor(cardName, cardClass) {
    var me = this;

    me.cardEl = null;
    me.cardName = cardName;
    me.cardClass = cardClass;
    me.tile = null;
    me.placementRules = [];
    me.cardType = 0;
    me.createCard();
  }

  createCard() {
    var me = this;

    me.cardEl = $(
      `
      <div class="card" data-card="${me.cardClass}">
          <div class="card-model">
            <div class="card-model-circle"></div>
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

  drawnCard() {
    var me = this;

    controllers.Elements.cardBox.append(me.cardEl);
    
    autoSizeTextElement(me.cardEl.find('.card-name')[0]);

    me.cardEl.bind({
      mousedown: dragDropFN.mousedown,
    });
  }
}
