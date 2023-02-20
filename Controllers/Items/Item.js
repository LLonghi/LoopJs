import { Configs } from "../Configs.js";

const configs = Configs();

let _itemId = 0;

function generateStatus(item) {
    console.log('Todo: generate item status')
}

export default class Item {
  constructor(itemName, itemClass, itemType) {
    var me = this;

    _itemId++;

    me.id = _itemId;
    me.itemName = itemName;
    me.itemClass = itemClass;
    me.itemEl = null;
    me.type = itemType;
    me.status = null;
    me.tier = 0;
  }

  createItem() {
    var me = this;

    generateStatus(me);

    me.itemEl = $(`<div class="equipment ${me.itemClass}" data-item-id="${
      me.id
    }" data-item-type="${
      me.type
    }"></div>`);
    
    me.itemEl.bind({
      mousedown: dragDropFN.mousedown,
      obj: me,
    });
  }

  discard() {
    const me = this;

    console.log('removing this item', me)
    
    var sfx = new Audio("/Assets/sound/card_burn.mp3");
    sfx.volume = configs.sfxVolume;
    sfx.play();

    me.itemEl[0].animate(
      [
        { transform: "translateY(0px)", opacity: 1 },
        { transform: "translateY(-200px)", opacity: 0 },
      ],
      {
        duration: 300,
      }
    );

    me.itemEl.addClass("item-hidden");

    setTimeout(() => {
      me.itemEl[0].remove();
    }, 300);
  }

  equip() {}

}