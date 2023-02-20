import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Belt extends Item {
  constructor() {
    super('Belt','item-belt', ItemType.belt.type);
    var me = this;

  }

}