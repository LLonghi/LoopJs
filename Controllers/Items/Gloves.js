import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Gloves extends Item {
  constructor() {
    super('Gloves','item-gloves', ItemType.gloves.type);
    var me = this;

  }

}