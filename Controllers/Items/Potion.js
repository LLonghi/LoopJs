import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Potion extends Item {
  constructor() {
    super('Potion','item-potion', ItemType.potion.type);
    var me = this;

  }

}