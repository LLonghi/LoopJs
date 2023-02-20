import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Boots extends Item {
  constructor() {
    super('Boots','item-boots', ItemType.boots.type);
    var me = this;

  }

}