function dragDropCards(dragged) {
  let cardType = dragged.data("card-type"),
    overrideTile = dragged.data("override");
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

  highlighItems = highlighItems
    .filter((t) => !t.tileTransformed || overrideTile)
    .map((t) => t.el);

  highlighItems.forEach((element) => {
    element.addClass("highlight-drop");
  });
}

function cardUpHandler(dragged, orignalOffset, e) {
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
}

function itemUpHandler(dragged, orignalOffset, e) {
  let slot = e.target.closest(".cnt-item-tile.equipment-slot");

  if (slot) {
    if (slot.firstElementChild.classList.contains(dragged.data("item-type"))) {
      dragged.css({
        "pointer-events": "initial",
        "position": "initial",
      });
      window.globalEnv.inventory.equipItem(slot, dragged.data("item-id"));
  
      return;
    }    
  }

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

dragDropFN = {
  mousedown: function (e) {
    if (e.which == 1) {
      $(document.body).css({ "user-select": "none" });

      var dragged = $(e.target).closest(".card, .equipment"),
        orignalOffset = dragged.offset(),
        highlighItems = [];

      if (dragged.hasClass("card")) {
        dragDropCards(dragged);
      }

      if (dragged.hasClass("equipment")) {
      }

      dragged.css({
        left: e.pageX,
        top: e.pageY,
      });

      dragged.css({
        "pointer-events": "none",
      });

      var upHandler = function (e) {
        let tile = e.target.closest(".table-tile");

        if (dragged.hasClass("card")) {
          cardUpHandler(dragged, orignalOffset, e);
        } else if (dragged.hasClass("equipment")) {
          itemUpHandler(dragged, orignalOffset, e);
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
