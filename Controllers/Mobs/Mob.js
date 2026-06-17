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

// Stats-base padrão usados quando um mob não informa os seus.
const DEFAULT_STATS = {
  life: 20,
  attack: 6,
  defense: 1,
  attackSpeed: 1,
  variance: 0.2,
  expDrop: 10,
  cardDropChance: 0,
  itemDropChance: 0,
};

function rndBetween(min, max) {
  return min + Math.random() * (max - min);
}

export default class Mob {
  constructor(mobName, mobClass, stats) {
    var me = this;

    me.mobName = mobName;
    me.mobClass = mobClass;
    me.dead = false;
    me.movements = [];
    me.currentMovement = 0;
    me.walk = false;

    me.baseStats = Object.assign({}, DEFAULT_STATS, stats || {});

    me.rollStats();
  }

  // Define os atributos do mob escalando pelo nível do loop e aplicando
  // uma variação aleatória, de modo que dois mobs iguais não sejam idênticos.
  rollStats() {
    var me = this;

    let loop = 0;
    try {
      loop = controllers.Stats.Loop.curentLoop() || 0;
    } catch (e) {}

    const levelScale = 1 + loop * 0.35;
    const v = me.baseStats.variance;
    const vary = () => rndBetween(1 - v, 1 + v);

    me.level = loop + 1;

    me.maxLife = Math.max(1, Math.round(me.baseStats.life * levelScale * vary()));
    me.life = me.maxLife;
    me.attack = Math.max(1, Math.round(me.baseStats.attack * levelScale * vary()));
    me.defense = Math.max(0, Math.round(me.baseStats.defense * levelScale * vary()));
    me.attackSpeed = me.baseStats.attackSpeed;

    me.expDrop = Math.round(me.baseStats.expDrop * levelScale);
    me.cardDropChance = me.baseStats.cardDropChance;
    me.itemDropChance = me.baseStats.itemDropChance;
  }

  // Aplica dano; retorna true se o mob morreu.
  takeDamage(amount) {
    var me = this;
    me.life -= amount;
    return me.life <= 0;
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

    if (me.cardDropChance > _cardDropChance)
      window.globalEnv.cardHand.addCard();

    if (me.itemDropChance > _itemDropChance)
      window.globalEnv.inventory.addItem();
      window.globalEnv.inventory.addItem();
  }
}
