import { Elements } from "./Elements.js";
import { Configs } from "./Configs.js";

const elements = Elements();
const configs = Configs();

export function Hero() {
  return {
    move: function (coordinates, noAnimation) {
      var tile = $(`[data-coordinate="${coordinates.row}-${coordinates.col}"]`);
      var position = tile.offset(),
        x = position.top + tile.height() / 2 - elements.hero.height() / 2,
        y = position.left + tile.width() / 2 - elements.hero.width() / 2;

      if (elements.hero.position().left < y) {
        elements.hero.addClass('walking-right')
        elements.hero.removeClass('walking-left')
      } else if (elements.hero.position().left > y) {
        elements.hero.addClass('walking-left')
        elements.hero.removeClass('walking-right')
      }

      elements.hero.attr("data-current-tile", tile.attr("data-coordinate"));
      elements.hero.animate(
        {
          top: x,
          left: y,
          easing: "linear",
        },
        noAnimation ? 0 : configs.walkSpeed
      );
    },
    currentCoordinate: function () {
      return elements.hero.attr("data-current-tile");
    },
    currentTile: function () {
      var tile = $(
        `[data-coordinate="${elements.hero.attr("data-current-tile")}"]`
      );
      return tile;
    },
  };
}
