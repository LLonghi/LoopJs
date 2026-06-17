import ItemType from "./ItemType.js";
import { Configs } from "../Configs.js";
import { sumAttributes } from "../Attributes.js";

const configs = Configs();

function shuffleItems(items) {
  items.forEach((item) => {
    let parent = item.itemEl.parent(),
      currentSlot = parent.attr("data-inventory-slot"),
      prevNode = parent.prev();

    if (currentSlot > "1") {
      if(prevNode.children().map((i,el) =>{if (!$(el).hasClass('item-hidden')) return el}).length == 0)
      item.itemEl.appendTo(prevNode);
    }
  });
}

export default class Inventory {
  constructor() {
    var me = this;

    me.items = [];
    // Itens equipados, indexados pelo elemento DOM do slot (cada slot é único,
    // o que permite ter dois anéis em slots diferentes sem conflito).
    me.equippedSlots = new Map();
  }

  // Soma os modificadores de todos os itens equipados e aplica no herói.
  recomputeHeroAttributes() {
    var me = this;
    const list = [];
    me.equippedSlots.forEach((item) => {
      if (item && item.getAttributes()) list.push(item.getAttributes());
    });

    const total = sumAttributes(list);
    if (window.globalEnv.hero) window.globalEnv.hero.applyEquipment(total);
  }

  addItem() {
    var me = this,
      rndItemIndex = Math.floor(Math.random() * Object.keys(ItemType).length),
      _itemClass = ItemType[Object.keys(ItemType)[rndItemIndex]].class,
      _item = new _itemClass();

    _item.createItem();

    if (me.items.length > 11) {
      let itemToRemove = me.items[0];
      me.discardItem(itemToRemove);
    }

    me.items.push(_item);

    $(controllers.Elements.inventory[me.items.length - 1]).append(_item.itemEl);

    var sfx = new Audio("/Assets/sound/card_new.wav");
    sfx.volume = configs.sfxVolume;
    sfx.play();
  }

  discardItem(item) {
    var me = this;

    item.discard();

    shuffleItems(me.items);

    me.items.splice(0, 1);
  }

  equipItem(slot, itemId) {
    var me = this,
      item = me.items.find((i) => i.id == itemId);

    if (item) {
      // Se já houver um item neste slot, ele é substituído (descartado).
      const previous = me.equippedSlots.get(slot);
      if (previous && previous !== item) {
        previous.itemEl.remove();
      }

      item.itemEl.appendTo(slot);
      me.equippedSlots.set(slot, item);

      shuffleItems(me.items);

      me.items.splice(
        me.items.findIndex((i) => i.id == itemId),
        1
      );

      const defaultEl = slot.querySelector(".equipment-default");
      if (defaultEl) defaultEl.hidden = true;

      me.recomputeHeroAttributes();

      var sfx = new Audio("/Assets/sound/card_place.mp3");
      sfx.volume = configs.sfxVolume;
      sfx.play();
    } else {
      console.log("Erro ao soltar item");
    }
  }
}
