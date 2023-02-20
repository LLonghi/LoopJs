import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Ring extends Item {
  constructor() {
    super('Ring','item-ring', ItemType.ring.type);
    var me = this;

  }

}