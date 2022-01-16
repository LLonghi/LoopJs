var autoSizeText;
var autoSizeTextElement;

autoSizeText = function () {
  var el,
    elements = $(".text-fit-resize"),
    _len,
    _results = [];

  if (elements.length < 0) {
    return;
  }

  for (let _i = 0, _len = elements.length; _i < _len; _i++) {
    el = elements[_i];
    _results.push(
      (function (el) {
        var resizeText, _results1;
        resizeText = function () {
          var elNewFontSize;
          elNewFontSize =
            parseInt($(el).css("font-size").slice(0, -2)) - 1 + "px";
          return $(el).css("font-size", elNewFontSize);
        };
        _results1 = [];
        while (el.scrollHeight > el.offsetHeight) {
          _results1.push(resizeText());
        }
        return _results1;
      })(el)
    );
  }
  return _results;
};

autoSizeTextElement = function (element) {
  if (!element) {
    return;
  }

  return (function (el) {
    var resizeText, _results1;

    resizeText = function () {
      var elNewFontSize;
      elNewFontSize = parseInt($(el).css("font-size").slice(0, -2)) - 1 + "px";
      return $(el).css("font-size", elNewFontSize);
    };

    _results1 = [];

    while (el.scrollHeight > el.offsetHeight) {
      _results1.push(resizeText());
    }

    return _results1;
  })(element);
};

$(document).ready(function () {
  return autoSizeText();
});
