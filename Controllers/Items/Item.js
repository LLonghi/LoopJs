import { Configs } from "../Configs.js";
import { generateItemStats } from "./ItemStats.js";
import { ATTRIBUTES, formatAttribute } from "../Attributes.js";

const configs = Configs();

let _itemId = 0;

// Define o tier (poder) do item com base no progresso do loop e no nível do herói.
function currentTier() {
  let loop = 0;
  let level = 1;
  try {
    loop = controllers.Stats.Loop.curentLoop() || 0;
  } catch (e) {}
  try {
    level = window.globalEnv.hero ? window.globalEnv.hero.level : 1;
  } catch (e) {}
  return 1 + Math.floor(loop / 2) + Math.floor((level - 1) / 3);
}

function generateStatus(item) {
  item.status = generateItemStats(item.type, currentTier());
}

// Monta o HTML do tooltip que lista os modificadores do item.
function buildTooltip(item) {
  if (!item.status) return "";

  const lines = ATTRIBUTES.filter(
    (a) => (item.status.attributes[a.key] || 0) !== 0
  )
    .map((a) => {
      const isPrimary = a.key === item.status.primary;
      return `<div class="item-tooltip-line${
        isPrimary ? " item-tooltip-primary" : ""
      }"><span>${a.label}</span><span>${formatAttribute(
        a.key,
        item.status.attributes[a.key],
        true
      )}</span></div>`;
    })
    .join("");

  return `<div class="item-tooltip"><div class="item-tooltip-title">${item.itemName} · T${item.status.tier}</div>${lines}</div>`;
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
    me.tier = me.status ? me.status.tier : 0;

    me.itemEl = $(`<div class="equipment ${me.itemClass}" data-item-id="${
      me.id
    }" data-item-type="${
      me.type
    }">${buildTooltip(me)}</div>`);

    me.itemEl.bind({
      mousedown: dragDropFN.mousedown,
      obj: me,
    });
  }

  // Conjunto de modificadores que este item concede quando equipado.
  getAttributes() {
    return this.status ? this.status.attributes : null;
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
