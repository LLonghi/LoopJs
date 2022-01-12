import { Elements } from "./Elements.js";
import { Hero } from "./Hero.js";
import { Configs } from "./Configs.js";

const elements = Elements();
const hero = Hero();
const configs = Configs();

var tiles = [];
var tileRoad = [];
var currentCoordinates = null;
var campfireCoordinates = null;

function defineTileAsRoad(coordinates, curve) {
  var tile = tiles[coordinates.row][coordinates.col];
  tile.road = true;
  tile.el.addClass("tile-road");
  tile.el.addClass(curve);

  tileRoad.push(tile.el.attr("data-coordinate"));
}

function defineCampfire(coordinates) {
  campfireCoordinates = { col: coordinates.col, row: coordinates.row };
  var tile = tiles[coordinates.row][coordinates.col];
  tile.campFire = true;
  tile.canSpawn = false;
  tile.mobLimit = 0;
  tile.el.addClass("tile-campfire");

  tile.el.append(`<div class="pixelart-campfire "></div>`);
}

function drawTiles() {
  tiles.forEach(function (row) {
    row.forEach(function (tile) {
      tile.el = $(
        `<div class="table-tile" data-coordinate="${tile.row}-${tile.col}"><span class="tile-coordinates">${tile.row} - ${tile.col}</span></div>`
      );
      elements.table.append(tile.el);
    });
  });
}

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

function defineTileLayout(_lastCoord, _curentCoord, _nextCoord) {
  if (!_lastCoord || !_curentCoord || !_nextCoord) return "";

  //Ok
  //direita baixo
  if (
    _curentCoord.row == _lastCoord.row &&
    _curentCoord.row < _nextCoord.row &&
    _curentCoord.col > _lastCoord.col &&
    _curentCoord.col == _nextCoord.col
  )
    return "tile-curve-rd";

  //Ok
  //direita cima
  if (
    _curentCoord.row == _lastCoord.row &&
    _curentCoord.row > _nextCoord.row &&
    _curentCoord.col > _lastCoord.col &&
    _curentCoord.col == _nextCoord.col
  )
    return "tile-curve-ru";

  //Ok
  //esquerda baixo
  if (
    _curentCoord.row == _lastCoord.row &&
    _curentCoord.row < _nextCoord.row &&
    _curentCoord.col < _lastCoord.col &&
    _curentCoord.col == _nextCoord.col
  )
    return "tile-curve-ld";

  //Ok
  //esquerda cima
  if (
    _curentCoord.row == _lastCoord.row &&
    _curentCoord.row > _nextCoord.row &&
    _curentCoord.col < _lastCoord.col &&
    _curentCoord.col == _nextCoord.col
  )
    return "tile-curve-lu";

  //Ok
  // baixo esquerda
  if (
    _curentCoord.row > _lastCoord.row &&
    _curentCoord.row == _nextCoord.row &&
    _curentCoord.col == _lastCoord.col &&
    _curentCoord.col > _nextCoord.col
  )
    return "tile-curve-dl";

  //Ok
  // baixo direita
  if (
    _curentCoord.row > _lastCoord.row &&
    _curentCoord.row == _nextCoord.row &&
    _curentCoord.col == _lastCoord.col &&
    _curentCoord.col < _nextCoord.col
  )
    return "tile-curve-dr";

  //ok
  //cima esquerda
  if (
    _curentCoord.row < _lastCoord.row &&
    _curentCoord.row == _nextCoord.row &&
    _curentCoord.col == _lastCoord.col &&
    _curentCoord.col > _nextCoord.col
  )
    return "tile-curve-ul";

  //ok
  //cima direita
  if (
    _curentCoord.row < _lastCoord.row &&
    _curentCoord.row == _nextCoord.row &&
    _curentCoord.col == _lastCoord.col &&
    _curentCoord.col < _nextCoord.col
  )
    return "tile-curve-ur";

  //horizontal
  if (_curentCoord.row == _nextCoord.row && _curentCoord.row == _lastCoord.row)
    return "tile-horizontal";

  //vertical
  if (_curentCoord.col == _nextCoord.col && _curentCoord.col == _lastCoord.col)
    return "tile-vertical";

  return "";
}

export function World() {
  return {
    createTiles: function () {
      for (let row = 0; row < 10; row++) {
        tiles[row] = [];
        for (let col = 0; col < 20; col++) {
          tiles[row][col] = {
            row: row,
            col: col,
            road: false,
            mobLimit: 5,
            canSpawn: true,
            mobs: [],
          };
        }
      }

      drawTiles(tiles);

      return tiles;
    },
    createLoop: function () {
      var _generatedPath = controllers.PathCreator.generate();

      if (Math.random() < 0.5) _generatedPath.reverse();

      var _camp =
        _generatedPath[Math.floor(Math.random() * _generatedPath.length)];

      defineCampfire({ row: _camp.l, col: _camp.c });

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
          defineTileAsRoad(
            { row: _coord.l, col: _coord.c },
            defineTileLayout(
              { row: ultimo.l, col: ultimo.c },
              { row: _coord.l, col: _coord.c },
              { row: proximo.l, col: proximo.c }
            )
          );
        }, 20 * index);
      }

      //Caminho criado a mao enquanto o script de route nao esta feito
      //       defineTileAsRoad(firstTileCoordinates, "tile-curve-ld");
      //       defineTileAsRoad({ row: 4, col: 3 }, "tile-vertical");
      //       defineTileAsRoad({ row: 5, col: 3 }, "tile-curve-dr");
      //       defineTileAsRoad({ row: 5, col: 4 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 5, col: 5 }, "tile-curve-rd");
      //       defineTileAsRoad({ row: 6, col: 5 }, "tile-curve-dr");
      //       defineTileAsRoad({ row: 6, col: 6 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 6, col: 7 }, "tile-curve-rd");
      //       defineTileAsRoad({ row: 7, col: 7 }, "tile-vertical");
      //       defineTileAsRoad({ row: 8, col: 7 }, "tile-curve-dr");
      //       defineTileAsRoad({ row: 8, col: 8 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 8, col: 9 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 8, col: 10 }, "tile-curve-ru");
      //       defineTileAsRoad({ row: 7, col: 10 }, "tile-vertical");
      //       defineTileAsRoad({ row: 6, col: 10 }, "tile-curve-ur");
      //       defineTileAsRoad({ row: 6, col: 11 }, "tile-curve-ru");
      //       defineTileAsRoad({ row: 5, col: 11 }, "tile-curve-ur");
      //       defineTileAsRoad({ row: 5, col: 12 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 5, col: 13 }, "tile-curve-ru");
      //       defineTileAsRoad({ row: 4, col: 13 }, "tile-vertical");
      //       defineTileAsRoad({ row: 3, col: 13 }, "tile-vertical");
      //       defineTileAsRoad({ row: 2, col: 13 }, "tile-curve-ul");
      //       defineTileAsRoad({ row: 2, col: 12 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 2, col: 11 }, "tile-curve-ld");
      //       defineTileAsRoad({ row: 3, col: 11 }, "tile-curve-dl");
      //       defineTileAsRoad({ row: 3, col: 10 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 3, col: 9 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 3, col: 8 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 3, col: 7 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 3, col: 6 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 3, col: 5 }, "tile-horizontal");
      //       defineTileAsRoad({ row: 3, col: 4 }, "tile-horizontal");
    },
    spawnHero: function () {
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

          spawnMobs();

          startDay();
    
          move();
      }, 600);
    },
  };
}
