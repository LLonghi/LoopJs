import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();


export default class Armor extends Item {
  constructor() {
    super('Armor','item-armor', ItemType.armor.type);
    var me = this;

  }
 
}
