dragDropFN = {
  mousedown: function (e) {
    if (e.which == 1) {
      $(document.body).css({ "user-select": "none" });

      var dragged = $(e.target).closest(".card, .equipment"),
        orignalOffset = dragged.offset();

      dragged.css({
        left: e.pageX,
        top: e.pageY,
      });

      dragged.css({
        "pointer-events": "none",
      });

      var upHandler = function (e) {
        console.log("Dropped on target: ", e.target);
        dragged.removeClass("absolute");
        dragged.css({
          "pointer-events": "all",
        });
        dragged.offset({
          top: orignalOffset.top,
          left: orignalOffset.left,
        });
        $(document.body).css({ "user-select": "initial" });
        $("body").off("mouseup", upHandler);
        $("body").off("mousemove", moveHandler);
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
