dragDropFN = {
  mousedown: function (e) {
    if (e.which == 1) {
      $(document.body).css({ "user-select": "none" });

      var dragged = $(e.target).closest(".card, .equipment"),
        orignalOffset = dragged.offset(),
        highlighItems = [];

      if (dragged.hasClass("card")) {
        let cardType = dragged.data("card-type"),
          overrideTile =dragged.data("override");
        switch (cardType) {
          case 1:
            highlighItems = controllers.World.getRoadTiles();
            break;
          case 2:
            highlighItems = controllers.World.getSideRoadTiles();
            break;
          case 3:
            highlighItems = controllers.World.getLandscapeTiles();
            break;
          case 4:
            highlighItems = controllers.World.getTiles();
            break;
        }

        highlighItems = highlighItems.filter((t) => !t.tileTransformed || overrideTile).map((t) => t.el);
      }
      if (dragged.hasClass("equipment")) {
      }

      highlighItems.forEach((element) => {
        element.addClass("highlight-drop");
      });

      dragged.css({
        left: e.pageX,
        top: e.pageY,
      });

      dragged.css({
        "pointer-events": "none",
      });

      var upHandler = function (e) {
        let tile = e.target.closest(".table-tile");

        if (
          tile &&
          tile.classList.contains("table-tile") &&
          tile.classList.contains("highlight-drop")
        ) {
          window.globalEnv.cardHand.placeCard(
            dragged.data("card-id"),
            tile.dataset.coordinate
          );
        } else {
          dragged.removeClass("absolute");
          dragged.css({
            "pointer-events": "all",
          });
          dragged.offset({
            top: orignalOffset.top,
            left: orignalOffset.left,
          });
          setTimeout(() => {
            dragged[0].style = "";
          }, 400);
        }

        $(document.body).css({ "user-select": "initial" });
        $("body").off("mouseup", upHandler);
        $("body").off("mousemove", moveHandler);

        highlighItems.forEach((element) => {
          element.removeClass("highlight-drop");
        });
      };

      var moveHandler = function (e) {
        dragged.addClass("absolute");

        dragged.offset({
          left: e.pageX,
          top: e.pageY,
        });
      };

      $("body").bind({
        mouseup: upHandler,
        mousemove: moveHandler,
      });
    }
  },
};

$(document).ready(function () {
  $(".equipment").bind({
    mousedown: dragDropFN.mousedown,
  });
});
