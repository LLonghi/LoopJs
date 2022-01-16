import { Elements } from "../Elements.js";
import { Configs } from "../Configs.js";

const elements = Elements();
const configs = Configs();

function updateLifeCounter(life, maxLife) {
  var progressEl = elements.stats.life,
    bar = progressEl.find(".life-stat"),
    text = progressEl.find(".stat-counter");

  bar.width(`${(life / maxLife) * 100}%`);
  text.html(`${life}/${maxLife}`);
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
    me.lifePoints = 32;
    me.lifeMaxPoints = 32;
    me.coordinates = {
      row: -1,
      col: -1,
    };
  }

  drawHero() {
    var me = this;

    me.el = $('<div class="hero"></div>');

    $("body").append(me.el);

    updateLifeCounter(me.lifePoints, me.lifeMaxPoints);
    updateExpCounter(me.exp, me.expNextLevel);

    window.globalEnv.hero = me;
  }

  setLifePoints(points) {
    var me = this;

    me.lifePoints += points;
    updateLifeCounter(me.lifePoints, me.lifeMaxPoints);
  }

  setLifeMaxPoints(points) {
    var me = this;

    me.lifeMaxPoints += points;
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

    me.exp -= me.expNextLevel;
    me.expNextLevel = Math.ceil(me.expNextLevel * configs.lvlUpExpMultiplier);

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
