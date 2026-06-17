import Slime from "./Mobs/Slime.js";
import ToxicSlime from "./Mobs/ToxicSlime.js";
import FrostSlime from "./Mobs/FrostSlime.js";
import MagmaSlime from "./Mobs/MagmaSlime.js";
import Wolf from "./Mobs/Wolf.js";
import KingSlime from "./Mobs/KingSlime.js";

export function Mobs() {
  return {
    Slime: Slime,
    ToxicSlime: ToxicSlime,
    FrostSlime: FrostSlime,
    MagmaSlime: MagmaSlime,
    Wolf: Wolf,
    KingSlime: KingSlime,
  };
}
