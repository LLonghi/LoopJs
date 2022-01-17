import { Elements } from "../Elements.js";
import { Configs } from "../Configs.js";
import { Cards } from "../Cards.js";

var elements = Elements();
const configs = Configs();
const cards = Cards();

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNewPosition(tile) {
  var nh = Math.floor(randomIntFromInterval(0, tile.height()));
  var nw = Math.floor(randomIntFromInterval(0, tile.width()));

  return [nh, nw];
}

function walk(mob) {
  if (mob.dead) return;

  if (mob.walk) {
    if (mob.currentMovement > 9) mob.currentMovement = 0;

    var tile = mob.tile.el;
    var position = tile.offset(),
      newPosition = mob.movements[mob.currentMovement],
      x = position.top + newPosition[0] - mob.el.height() / 2,
      y = position.left + newPosition[1] - mob.el.width() / 2;

    if (y < position.left) y = position.left;

    if (mob.el.position().left < y) {
      mob.el.addClass("mob-walking-right");
      mob.el.removeClass("mob-walking-left");
    } else if (mob.el.position().left > y) {
      mob.el.addClass("mob-walking-left");
      mob.el.removeClass("mob-walking-right");
    }

    mob.el.animate(
      {
        top: x,
        left: y,
      },
      controllers.Configs.mobWalkSpeed
    );

    mob.currentMovement++;
  }
  setTimeout(() => {
    walk(mob);
  }, controllers.Configs.mobWalkSpeed);
}

export default class Mob {
  constructor(mobName, mobClass) {
    var me = this;

    me.level = 1;
    me.mobName = mobName;
    me.mobClass = mobClass;
    me.dead = false;
    me.movements = [];
    me.currentMovement = 0;
    me.walk = false;
    me.expDrop = 0;
    me.cardDropChance = 0;
    me.itemDropChance = 0;
  }

  spawn() {
    var me = this;

    for (var i = 0; i < 10; i++) {
      me.movements.push(getNewPosition(me.tile.el));
    }

    me.el = $(`<div class="${me.mobClass}"></div>`);
    me.tile.el.append(me.el);

    setTimeout(() => {
      me.walk = true;
      walk(me);
    }, 200);
  }

  kill() {
    var me = this;

    me.drop();

    me.el.addClass("mob-dead");
    me.tile.mobs.splice(me.tile.mobs.indexOf(me), 1);
    me.el.fadeOut(200, function () {
      me.el.remove();
    });
    me.dead = true;
  }

  drop() {
    var me = this,
      _cardDropChance = Math.round(Math.random() * 100),
      _itemDropChance = Math.round(Math.random() * 100);

    window.globalEnv.hero.addExp(me.expDrop);

    if (me.cardDropChance > _cardDropChance) {
      console.log(`drop card (${me.cardDropChance}/${_cardDropChance})`);
      console.log("Todo: drop card");

      let cardDrops = [cards.MountainCard,
        cards.GrooveCard,
        cards.SpiderCocoonCard,
        cards.SwampCard]

        const rndInt = Math.floor(Math.random() * 4) 

        var card = new cardDrops[rndInt];
        window.globalEnv.cardHand.push(card);

        card.drawCard();
    }

    if (me.itemDropChance > _itemDropChance) {
      console.log(`drop item (${me.itemDropChance}/${_itemDropChance})`);
      console.log("Todo: drop item");
    }
  }
}
