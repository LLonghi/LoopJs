import { Configs } from "../Configs.js";

const configs = Configs();

let _itemId = 0;

export default class Item {
  constructor(itemName, itemClass) {
    var me = this;

    _cardId++;

    me.id = _itemId;
    me.itemName = itemName;
    me.itemClass = itemClass;
    me.el = null;
  }

  drawItem() {
    var me = this;

    me.el = $(`<div class="equipment ${me.itemClass}"></div>`);
  }

  discard() {}

  equip() {}
}
