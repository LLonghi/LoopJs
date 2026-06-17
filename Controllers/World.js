import { Elements } from "./Elements.js";
import Hero from "./Hero/Hero.js";
import { Configs } from "./Configs.js";
import { Cards } from "./Cards.js";
import Tile from "./Tiles/Tile.js";

const elements = Elements();
const hero = new Hero();
const configs = Configs();
const cards = Cards();

var tiles = [];
var tileRoad = [];
var currentCoordinates = null;
var campfireCoordinates = null;
var autoTimer = null; // timer do passo automático (permite cancelar ao pular o dia)
var gameStarted = false;
var skipping = false;

function defineSideRoadTiles() {
  let _tiles = controllers.World.getTiles().filter((t) => !t.road);
  _tiles.forEach((tile) => {
    let tileU = tile.row - 1 > -1 ? tiles[tile.row - 1][tile.col] : null,
      tileD =
        tile.row + 1 < tiles.length ? tiles[tile.row + 1][tile.col] : null,
      tileL = tile.col - 1 > -1 ? tiles[tile.row][tile.col - 1] : null,
      tileR =
        tile.col + 1 < tiles[0].length ? tiles[tile.row][tile.col + 1] : null;

    if (
      (tileU && tileU.road) ||
      (tileD && tileD.road) ||
      (tileL && tileL.road) ||
      (tileR && tileR.road)
    ) {
      if (!tile.road) tile.sideRoad = true;
    }
  });
}

function move() {
  let coordinates = nextTileCoordinates();
  currentCoordinates = coordinates;
  hero.move(coordinates);

  const regen = hero.getAttribute("lifeRegen");
  if (regen > 0) hero.heal(regen);
  //TODO: for better results, this should be transormed into a promisse
  autoTimer = setTimeout(() => {
    autoTimer = null;
    if (coordinates.newLoop) {
      spawnMobs();
      controllers.Stats.Loop.changeLoop();
    }
    checkForFight(move);
  }, configs.walkSpeed + 10);
}

// Processa a chegada do herói num tile (regen, novo loop e combate),
// reaproveitado tanto pelo passo normal quanto pela simulação do "pular o dia".
function processArrival(coordinates) {
  currentCoordinates = coordinates;

  const regen = hero.getAttribute("lifeRegen");
  if (regen > 0) hero.heal(regen);

  if (coordinates.newLoop) {
    spawnMobs();
    controllers.Stats.Loop.changeLoop();
  }

  let tileObj = controllers.World.getTiles().filter(
    (tile) => tile.row == coordinates.row && tile.col == coordinates.col
  )[0];
  if (tileObj && tileObj.mobs.length) resolveCombat(tileObj);
}

// Resolve, sem nenhuma animação, todos os eventos da rota a partir da posição
// atual até a fogueira (combates, spawns, drops e o loop) e teleporta o herói.
function simulateDay() {
  // Conclui o passo atual cujo timer foi cancelado (spawn/loop e combate
  // pendentes do tile onde o herói está), para não pular nenhum evento.
  if (currentCoordinates) {
    if (currentCoordinates.newLoop) {
      spawnMobs();
      controllers.Stats.Loop.changeLoop();
    }
    let curTile = controllers.World.getTiles().filter(
      (tile) =>
        tile.row == currentCoordinates.row && tile.col == currentCoordinates.col
    )[0];
    if (curTile && curTile.mobs.length) resolveCombat(curTile);
  }

  // Caminha pela rota só com índices (sem mover o boneco) até a fogueira.
  let idx = tileRoad.indexOf(hero.currentCoordinate());
  let arrivedCampfire = false;
  let safety = 0;
  const maxSteps = tileRoad.length + 2;

  while (!arrivedCampfire && safety++ < maxSteps) {
    idx = (idx + 1) % tileRoad.length;
    let coord = tileRoad[idx].split("-");
    let newLoop =
      campfireCoordinates.row == coord[0] && campfireCoordinates.col == coord[1];

    processArrival({ row: coord[0], col: coord[1], newLoop: newLoop });
    arrivedCampfire = newLoop;
  }

  // Teleporta o herói para a fogueira (sem animação de percurso).
  hero.el.stop(true, true);
  hero.move(campfireCoordinates, true);
}

// "Pular o dia": escurece a tela (troca de cena), resolve o dia inteiro com o
// herói teleportado para a fogueira e clareia a tela de volta.
function skipDay() {
  if (skipping || !gameStarted || !campfireCoordinates) return;
  skipping = true;

  if (autoTimer) {
    clearTimeout(autoTimer);
    autoTimer = null;
  }

  const overlay = $(".scene-transition");
  const FADE = 250;

  overlay.addClass("active"); // fade para preto
  setTimeout(() => {
    simulateDay(); // tudo acontece com a tela escura

    overlay.removeClass("active"); // fade de volta ao normal

    skipping = false;
    move(); // retoma o ciclo automático a partir da fogueira
  }, FADE);
}

function nextTileCoordinates() {
  let currentIndex = tileRoad.indexOf(hero.currentCoordinate()),
    nextTile = currentIndex + 1,
    newLoop = false;

  if (nextTile > tileRoad.length - 1) {
    nextTile = 0;
  }

  var coord = tileRoad[nextTile].split("-");

  if (
    campfireCoordinates.row == coord[0] &&
    campfireCoordinates.col == coord[1]
  )
    newLoop = true;

  return { row: coord[0], col: coord[1], newLoop: newLoop };
}

// Escolhe o tipo de mob a nascer, com tipos mais difíceis liberados conforme
// o loop avança. Retorna a classe do mob (ainda não instanciada).
function pickMobClass() {
  let loop = controllers.Stats.Loop.curentLoop() || 0;
  const M = controllers.Mobs;

  const pool = [{ c: M.Slime, w: 50 }];
  if (loop >= 1) {
    pool.push({ c: M.Wolf, w: 20 });
    pool.push({ c: M.ToxicSlime, w: 20 });
  }
  if (loop >= 2) pool.push({ c: M.FrostSlime, w: 15 });
  if (loop >= 3) pool.push({ c: M.MagmaSlime, w: 15 });
  if (loop >= 4) pool.push({ c: M.KingSlime, w: 4 });

  const totalWeight = pool.reduce((sum, p) => sum + p.w, 0);
  let roll = Math.random() * totalWeight;
  for (let i = 0; i < pool.length; i++) {
    roll -= pool[i].w;
    if (roll <= 0) return pool[i].c;
  }
  return M.Slime;
}

function spawnMobs() {
  let _roadTiles = controllers.World.getRoadTiles();

  _roadTiles
    .filter((tile) => tile.canSpawn && tile.mobs.length < tile.mobLimit)
    .forEach((tile) => {
      var chance = Math.random() * 100;
      if (chance < 10) {
        let MobClass = pickMobClass();
        let mob = new MobClass(tile);
        mob.spawn();
        tile.mobs.push(mob);
      }
    });
}

function rollChance(percent) {
  return Math.random() * 100 < percent;
}

// Número de ataques no round considerando a velocidade de ataque fracionária.
function attacksThisRound(speed) {
  let attacks = Math.floor(speed);
  if (Math.random() < speed - attacks) attacks++;
  return Math.max(1, attacks);
}

// Resolve a luta do herói contra todos os mobs presentes no tile.
function resolveCombat(tile) {
  const hero = window.globalEnv.hero;
  const mobs = tile.mobs.slice(); // cópia: kill() altera tile.mobs

  for (let m = 0; m < mobs.length; m++) {
    const mob = mobs[m];
    if (mob.dead) continue;

    let safety = 0;
    while (!mob.dead && safety++ < 1000) {
      // Investida do herói (pode ter múltiplos golpes por velocidade de ataque).
      const heroHits = attacksThisRound(hero.getAttribute("attackSpeed"));
      let killed = false;
      for (let h = 0; h < heroHits && !killed; h++) {
        const crit = rollChance(hero.getAttribute("critChance"));
        let dmg = hero.getAttribute("attack") * (crit ? 1.5 : 1) - mob.defense;
        dmg = Math.max(1, Math.round(dmg));

        const vamp = hero.getAttribute("vampirism");
        if (vamp > 0) hero.heal((dmg * vamp) / 100);

        killed = mob.takeDamage(dmg);
      }

      if (killed) {
        mob.kill();
        break;
      }

      // Contra-ataque do mob (esquiva do herói pode anular o golpe).
      const mobHits = attacksThisRound(mob.attackSpeed);
      let heroDied = false;
      for (let h = 0; h < mobHits && !heroDied; h++) {
        if (rollChance(hero.getAttribute("evasion"))) continue;
        let dmg = mob.attack - hero.getAttribute("defense");
        dmg = Math.max(1, Math.round(dmg));
        heroDied = hero.takeDamage(dmg);
      }
    }
  }
}

function checkForFight(callback) {
  let _currentTileObj = controllers.World.getTiles().filter(
    (tile) =>
      tile.row == currentCoordinates.row && tile.col == currentCoordinates.col
  )[0];
  if (_currentTileObj.mobs.length) {
    resolveCombat(_currentTileObj);
  }
  callback();
}

function startDay() {
  console.log("Todo");
}

export function World() {
  return {
    createTiles: function (rows, columns) {
      rows = 10;
      columns = 20;
      for (let row = 0; row < rows; row++) {
        tiles[row] = [];
        for (let col = 0; col < columns; col++) {
          let _tile = new Tile(row, col);
          tiles[row][col] = _tile;

          _tile.drawTile();
        }
      }
    },

    createLoop: function () {
      var _generatedPath = controllers.PathCreator.generate();

      if (Math.random() < 0.5) _generatedPath.reverse();

      var _camp =
        _generatedPath[Math.floor(Math.random() * _generatedPath.length)];

      tiles[_camp.l][_camp.c].defineCampfire();

      campfireCoordinates = { col: _camp.c, row: _camp.l };

      for (let index = 0; index < _generatedPath.length; index++) {
        let _coord = _generatedPath[index],
          ultimo =
            index == 0
              ? _generatedPath[_generatedPath.length - 1]
              : _generatedPath[index - 1],
          proximo =
            index + 1 == _generatedPath.length
              ? _generatedPath[0]
              : _generatedPath[index + 1];

        setTimeout(() => {
          let _tile = tiles[_coord.l][_coord.c];
          tileRoad.push(_tile.el.attr("data-coordinate"));

          _tile.defineTileAsRoad(
            { row: ultimo.l, col: ultimo.c },
            { row: _coord.l, col: _coord.c },
            { row: proximo.l, col: proximo.c }
          );
        }, 20 * index);
      }
    },

    spawnHero: function () {
      hero.drawHero();
      hero.move(campfireCoordinates, true);
    },

    getSideRoadTiles: function () {
      return tiles.flatMap((tile) => tile).filter((x) => x.sideRoad);
    },

    getLandscapeTiles: function () {
      return tiles
        .flatMap((tile) => tile)
        .filter((x) => !x.sideRoad && !x.road);
    },

    getRoadTiles: function () {
      return tiles.flatMap((tile) => tile).filter((x) => x.road);
    },

    getTiles: function () {
      return tiles.flatMap((tile) => tile);
    },

    getTile: function (_r, _c) {
      return tiles
        .flatMap((tile) => tile)
        .filter((t) => t.col == _c && t.row == _r)[0];
    },

    skipDay: function () {
      skipDay();
    },

    play: function () {
      controllers.World.createTiles();

      controllers.World.createLoop();

      setTimeout(() => {
        defineSideRoadTiles();

        controllers.World.spawnHero();

        window.globalEnv.cardHand.addGoldenCard();

        spawnMobs();

        startDay();

        gameStarted = true;
        move();
      }, 600);
    },
  };
}
