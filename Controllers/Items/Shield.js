import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Shield extends Item {
  constructor() {
    super('Shield','item-shield', ItemType.shield.type);
    var me = this;

  }

}