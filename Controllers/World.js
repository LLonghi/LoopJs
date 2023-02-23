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
  //TODO: for better results, this should be transormed into a promisse
  setTimeout(() => {
    if (coordinates.newLoop) {
      spawnMobs();
      controllers.Stats.Loop.changeLoop();
    }
    checkForFight(move);
  }, configs.walkSpeed + 10);
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

function spawnMobs() {
  let _roadTiles = controllers.World.getRoadTiles();

  _roadTiles
    .filter((tile) => tile.canSpawn && tile.mobs.length < tile.mobLimit)
    .forEach((tile) => {
      var chance = Math.random() * 100;
      if (chance < 10) {
        let slime = new controllers.Mobs.Slime(tile);
        slime.spawn();
        tile.mobs.push(slime);
      }
    });
}

function checkForFight(callback) {
  let _currentTileObj = controllers.World.getTiles().filter(
    (tile) =>
      tile.row == currentCoordinates.row && tile.col == currentCoordinates.col
  )[0];
  if (_currentTileObj.mobs.length) {
    _currentTileObj.mobs.forEach(function (mob) {
      mob.kill();
    });
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

    play: function () {
      controllers.World.createTiles();

      controllers.World.createLoop();

      setTimeout(() => {
        defineSideRoadTiles();

        controllers.World.spawnHero();

        window.globalEnv.cardHand.addGoldenCard();

        spawnMobs();

        startDay();

        move();
      }, 600);
    },
  };
}
