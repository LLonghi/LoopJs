import { Elements } from "../Elements.js";
import { Configs } from "../Configs.js";

const elements = Elements();
const configs = Configs();

export default class Hero {
  constructor() {
    var me = this;

    me.el = null;
    me.exp = 0;
    me.expNextLevel = 100;
    me.life = 32;
    me.lifePoints = 32;
    me.coordinates = {
      row: -1,
      col: -1,
    };
  }

  drawHero() {
    var me = this;

    me.el = $('<div class="hero"></div>');

    $("body").append(me.el);
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
