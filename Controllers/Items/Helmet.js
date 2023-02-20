import Item from "./Item.js";
import { Configs } from "../Configs.js";
import ItemType from "./ItemType.js"
const configs = Configs();

export default class Helmet extends Item {
  constructor() {
    super('Helmet','item-helmet', ItemType.helmet.type);
    var me = this;

  }

}