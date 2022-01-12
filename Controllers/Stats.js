import { Elements } from "./Elements.js";

const elements = Elements();

export function Stats() {
  return {
    changeLife: function (current, max) {
      // elements.stats.life;
    },
    changeExp: function (current, max) {},
    Loop:{
      changeLoop: function () {
        elements.stats.loop.data('value',elements.stats.loop.data('value')+1)
        elements.stats.loop.html(elements.stats.loop.data('value'))
      },
      curentLoop:function(){
        return elements.stats.loop.data('value');
      }
    },    
    changeDayTime: function (current, max) {},
    changeBoosProgress: function (current, max) {},
  };
}
