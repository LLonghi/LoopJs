import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Amulet extends Item {
  constructor() {
    super('Amulet','item-amulet', ItemType.amulet.type);
    var me = this;

  }

}