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

var cardsHand = [];

function move() {
  let coordinates = nextTileCoordinates();
  currentCoordinates = coordinates;
  hero.move(coordinates);

  if (coordinates.newLoop) {
    spawnMobs();
    controllers.Stats.Loop.changeLoop();
  }

  checkForFight(() => {
    setTimeout(() => {
      move();
    }, configs.walkSpeed);
  });
}

function nextTileCoordinates() {
  let currentIndex = tileRoad.indexOf(hero.currentCoordinate()),
    nextTile = currentIndex + 1,
    newLoop = false;

  if (nextTile > tileRoad.length - 1) {
    nextTile = 0;
    newLoop = true;
  }

  var coord = tileRoad[nextTile].split("-");

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

    getRoadTiles: function () {
      return tiles.flatMap((tile) => tile).filter((x) => x.road);
    },

    getTiles: function () {
      return tiles.flatMap((tile) => tile);
    },

    play: function () {
      controllers.World.createTiles();

      controllers.World.createLoop();

      setTimeout(() => {
        controllers.World.spawnHero();

        cardsHand.push(new cards.MountainCard());
        cardsHand.push(new cards.GrooveCard());
        cardsHand.push(new cards.SpiderCocoonCard());
        cardsHand.push(new cards.SwampCard());

        cardsHand.forEach((_card) => {
          _card.drawCard();
        });

        spawnMobs();

        startDay();

        move();
      }, 600);
    },
  };
}