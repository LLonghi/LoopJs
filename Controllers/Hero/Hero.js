import { Elements } from "../Elements.js";
import { Configs } from "../Configs.js";
import {
  ATTRIBUTES,
  emptyAttributes,
  addAttributes,
  formatAttribute,
} from "../Attributes.js";

const elements = Elements();
const configs = Configs();

// Atributos-base do herói no nível 1 e o quanto cada um cresce por nível.
const BASE_ATTRIBUTES = {
  maxLife: 32,
  attack: 6,
  defense: 1,
  attackSpeed: 1,
  critChance: 5,
  evasion: 3,
  vampirism: 0,
  lifeRegen: 0,
};

const LEVEL_GROWTH = {
  maxLife: 6,
  attack: 2,
  defense: 1,
  attackSpeed: 0,
  critChance: 0,
  evasion: 0,
  vampirism: 0,
  lifeRegen: 0,
};

function updateLifeCounter(life, maxLife) {
  var progressEl = elements.stats.life,
    bar = progressEl.find(".life-stat"),
    text = progressEl.find(".stat-counter");

  bar.width(`${Math.max(0, (life / maxLife) * 100)}%`);
  text.html(`${Math.max(0, Math.round(life))}/${Math.round(maxLife)}`);
}

function updateExpCounter(exp, maxExp) {
  var progressEl = elements.stats.exp,
    bar = progressEl.find(".exp-stat"),
    text = progressEl.find(".stat-counter");

  bar.width(`${(exp / maxExp) * 100}%`);
  text.html(`${exp}/${maxExp}`);
}

export default class Hero {
  constructor() {
    var me = this;

    me.el = null;
    me.level = 1;
    me.exp = 0;
    me.expNextLevel = 100;

    me.baseAttributes = Object.assign({}, BASE_ATTRIBUTES);
    me.equipmentAttributes = emptyAttributes();
    me.attributes = emptyAttributes();

    me.lifeMaxPoints = BASE_ATTRIBUTES.maxLife;
    me.lifePoints = BASE_ATTRIBUTES.maxLife;

    me.computeAttributes(false);
    me.lifePoints = me.lifeMaxPoints;

    me.coordinates = {
      row: -1,
      col: -1,
    };
  }

  // Recalcula os atributos totais (base + equipamentos) e atualiza a UI.
  // keepLifeRatio: ao mudar a vida máxima, soma a diferença na vida atual.
  computeAttributes(keepLifeDelta) {
    var me = this;

    const previousMax = me.lifeMaxPoints;
    const total = emptyAttributes();
    addAttributes(total, me.baseAttributes);
    addAttributes(total, me.equipmentAttributes);

    me.attributes = total;
    me.lifeMaxPoints = total.maxLife;

    if (keepLifeDelta && typeof previousMax === "number") {
      me.lifePoints += me.lifeMaxPoints - previousMax;
    }
    if (me.lifePoints > me.lifeMaxPoints) me.lifePoints = me.lifeMaxPoints;
    if (me.lifePoints < 1 && !me.dead) me.lifePoints = 1;

    updateLifeCounter(me.lifePoints, me.lifeMaxPoints);
    me.renderAttributes();
  }

  // Aplica o total de modificadores vindos dos itens equipados.
  applyEquipment(attributes) {
    var me = this;
    me.equipmentAttributes = attributes || emptyAttributes();
    me.computeAttributes(true);
  }

  getAttribute(key) {
    return this.attributes[key] || 0;
  }

  renderAttributes() {
    var me = this;
    const container = elements.stats.attributes;
    if (!container || !container.length) return;

    const rows = ATTRIBUTES.filter((a) => a.key !== "maxLife")
      .map((a) => {
        const value = me.attributes[a.key] || 0;
        return `<div class="hero-attr"><span class="hero-attr-label">${a.label}</span><span class="hero-attr-value">${formatAttribute(
          a.key,
          value
        )}</span></div>`;
      })
      .join("");

    container.html(
      `<div class="hero-attr hero-attr-level"><span class="hero-attr-label">Nível</span><span class="hero-attr-value">${me.level}</span></div>${rows}`
    );
  }

  drawHero() {
    var me = this;

    me.el = $('<div class="hero"></div>');

    $("body").append(me.el);

    updateLifeCounter(me.lifePoints, me.lifeMaxPoints);
    updateExpCounter(me.exp, me.expNextLevel);
    me.renderAttributes();

    window.globalEnv.hero = me;
  }

  setLifePoints(points) {
    var me = this;

    me.lifePoints += points;
    if (me.lifePoints > me.lifeMaxPoints) me.lifePoints = me.lifeMaxPoints;
    if (me.lifePoints < 0) me.lifePoints = 0;
    updateLifeCounter(me.lifePoints, me.lifeMaxPoints);
  }

  setLifeMaxPoints(points) {
    var me = this;

    me.lifeMaxPoints += points;
    me.baseAttributes.maxLife += points;
    updateLifeCounter(me.lifePoints, me.lifeMaxPoints);
  }

  // Recebe dano já reduzido pela defesa; retorna true se o herói morreu.
  takeDamage(amount) {
    var me = this;
    if (amount <= 0) return false;

    me.setLifePoints(-amount);

    if (me.lifePoints <= 0) {
      me.die();
      return true;
    }
    return false;
  }

  heal(amount) {
    var me = this;
    if (amount <= 0) return;
    me.setLifePoints(amount);
  }

  die() {
    var me = this;
    console.log("O herói foi derrotado!");

    // Recomeço simples: restaura a vida cheia para não travar o loop.
    me.lifePoints = me.lifeMaxPoints;
    updateLifeCounter(me.lifePoints, me.lifeMaxPoints);
  }

  addExp(points) {
    var me = this;

    me.exp += points;

    if (me.exp > me.expNextLevel) me.levelUp();
    else updateExpCounter(me.exp, me.expNextLevel);
  }

  levelUp() {
    var me = this;

    me.level++;
    console.log(`Level up! (${me.level})`);

    var sfx = new Audio('/Assets/sound/level_up.wav')
    sfx.volume = configs.sfxVolume;
    sfx.play();

    me.exp -= me.expNextLevel;
    me.expNextLevel = Math.ceil(me.expNextLevel * configs.lvlUpExpMultiplier);

    ATTRIBUTES.forEach((a) => {
      me.baseAttributes[a.key] += LEVEL_GROWTH[a.key] || 0;
    });

    me.computeAttributes(true);
    me.lifePoints = me.lifeMaxPoints; // cura ao subir de nível
    updateLifeCounter(me.lifePoints, me.lifeMaxPoints);
    updateExpCounter(me.exp, me.expNextLevel);
  }

  move(coordinates, noAnimation) {
    var me = this;

    var tile = $(`[data-coordinate="${coordinates.row}-${coordinates.col}"]`);
    var position = tile.offset(),
      x = position.top + tile.height() / 2 - me.el.height() / 2,
      y = position.left + tile.width() / 2 - me.el.width() / 2;

    if (me.el.position().left < y) {
      me.el.addClass("walking-right");
      me.el.removeClass("walking-left");
    } else if (me.el.position().left > y) {
      me.el.addClass("walking-left");
      me.el.removeClass("walking-right");
    }

    me.el.attr("data-current-tile", tile.attr("data-coordinate"));
    me.el.animate(
      {
        top: x,
        left: y,
        easing: "linear",
      },
      noAnimation ? 0 : configs.walkSpeed
    );
  }

  currentCoordinate() {
    var me = this;

    return me.el.attr("data-current-tile");
  }

  currentTile() {
    var me = this;

    var tile = $(`[data-coordinate="${me.el.attr("data-current-tile")}"]`);
    return tile;
  }
}
