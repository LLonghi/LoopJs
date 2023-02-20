import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Grimoire extends Item {
  constructor() {
    super('Grimoire','item-grimoire', ItemType.grimoire.type);
    var me = this;

  }

}