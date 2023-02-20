import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Sword extends Item {
  constructor() {
    super('Sword','item-sword', ItemType.sword.type);
    var me = this;

  }

}