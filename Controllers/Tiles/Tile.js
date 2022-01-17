export default class Tile {
  constructor(row, col) {
    var me = this;

    me.el = null;
    me.tileType = 0;
    me.mobs = [];
    me.spawnChances = [];
    me.row = row;
    me.col = col;
    me.road = false;
    me.mobLimit = 0;
    me.canSpawn = false;
    me.campFire = false;
    me.sideRoad = false;
    me.tileTransformed = false;
  }

  drawTile() {
    var me = this;

    me.el = $(
      `<div class="table-tile" data-coordinate="${me.row}-${me.col}"><span class="tile-coordinates">${me.row} - ${me.col}</span></div>`
    );

    controllers.Elements.table.append(me.el);
  }

  addClass(_class) {
    var me = this;
    me.el.addClass(_class);
  }

  addMob() {}
  removeMob() {}

  defineTileAsRoad(_lastCoord, _curentCoord, _nextCoord) {
    var me = this;

    me.road = true;
    me.sideRoad = false;
    me.canSpawn = true;
    me.mobLimit = 5;
    me.addClass("tile-road");
    let curve = me.defineTileRoadLayout(_lastCoord, _curentCoord, _nextCoord);

    me.addClass(curve);
  }

  defineCampfire(coordinates) {
    var me = this;
    me.campFire = true;
    me.canSpawn = false;
    me.mobLimit = 0;
    me.addClass("tile-campfire");
    me.el.append(`<div class="pixelart-campfire "></div>`);
  }

  defineTileRoadLayout(_lastCoord, _curentCoord, _nextCoord) {
    if (!_lastCoord || !_curentCoord || !_nextCoord) return "";

    //direita baixo
    if (
      _curentCoord.row == _lastCoord.row &&
      _curentCoord.row < _nextCoord.row &&
      _curentCoord.col > _lastCoord.col &&
      _curentCoord.col == _nextCoord.col
    )
      return "tile-curve-rd";

    //direita cima
    if (
      _curentCoord.row == _lastCoord.row &&
      _curentCoord.row > _nextCoord.row &&
      _curentCoord.col > _lastCoord.col &&
      _curentCoord.col == _nextCoord.col
    )
      return "tile-curve-ru";

    //esquerda baixo
    if (
      _curentCoord.row == _lastCoord.row &&
      _curentCoord.row < _nextCoord.row &&
      _curentCoord.col < _lastCoord.col &&
      _curentCoord.col == _nextCoord.col
    )
      return "tile-curve-ld";

    //esquerda cima
    if (
      _curentCoord.row == _lastCoord.row &&
      _curentCoord.row > _nextCoord.row &&
      _curentCoord.col < _lastCoord.col &&
      _curentCoord.col == _nextCoord.col
    )
      return "tile-curve-lu";

    // baixo esquerda
    if (
      _curentCoord.row > _lastCoord.row &&
      _curentCoord.row == _nextCoord.row &&
      _curentCoord.col == _lastCoord.col &&
      _curentCoord.col > _nextCoord.col
    )
      return "tile-curve-dl";

    // baixo direita
    if (
      _curentCoord.row > _lastCoord.row &&
      _curentCoord.row == _nextCoord.row &&
      _curentCoord.col == _lastCoord.col &&
      _curentCoord.col < _nextCoord.col
    )
      return "tile-curve-dr";

    //cima esquerda
    if (
      _curentCoord.row < _lastCoord.row &&
      _curentCoord.row == _nextCoord.row &&
      _curentCoord.col == _lastCoord.col &&
      _curentCoord.col > _nextCoord.col
    )
      return "tile-curve-ul";

    //cima direita
    if (
      _curentCoord.row < _lastCoord.row &&
      _curentCoord.row == _nextCoord.row &&
      _curentCoord.col == _lastCoord.col &&
      _curentCoord.col < _nextCoord.col
    )
      return "tile-curve-ur";

    //horizontal
    if (
      _curentCoord.row == _nextCoord.row &&
      _curentCoord.row == _lastCoord.row
    )
      return "tile-horizontal";

    //vertical
    if (
      _curentCoord.col == _nextCoord.col &&
      _curentCoord.col == _lastCoord.col
    )
      return "tile-vertical";

    return "";
  }
}
