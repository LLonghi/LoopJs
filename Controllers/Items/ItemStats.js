import { emptyAttributes } from "../Attributes.js";

// Define, por tipo de item, o atributo principal (sempre presente) e os
// atributos secundários possíveis (coerentes com a função do item).
const STAT_TABLE = {
  sword: { primary: "attack", secondary: ["critChance", "attackSpeed", "vampirism"] },
  shield: { primary: "defense", secondary: ["maxLife", "evasion"] },
  armor: { primary: "maxLife", secondary: ["defense", "lifeRegen"] },
  helmet: { primary: "defense", secondary: ["maxLife", "evasion"] },
  gloves: { primary: "attackSpeed", secondary: ["attack", "critChance"] },
  boots: { primary: "evasion", secondary: ["attackSpeed", "lifeRegen"] },
  ring: { primary: "critChance", secondary: ["attack", "vampirism", "evasion"] },
  amulet: { primary: "maxLife", secondary: ["lifeRegen", "vampirism", "defense"] },
  belt: { primary: "maxLife", secondary: ["defense", "lifeRegen"] },
  grimoire: { primary: "attack", secondary: ["critChance", "vampirism"] },
  potion: { primary: "lifeRegen", secondary: ["maxLife"] },
};

// Faixa de valores (mínimo/máximo) de cada atributo no tier 1.
const VALUE_RANGE = {
  maxLife: [6, 14],
  attack: [2, 5],
  defense: [1, 3],
  attackSpeed: [0.05, 0.15],
  critChance: [2, 6],
  evasion: [2, 5],
  vampirism: [2, 5],
  lifeRegen: [0.5, 1.5],
};

function rndBetween(min, max) {
  return min + Math.random() * (max - min);
}

function rollValue(key, scale) {
  const range = VALUE_RANGE[key] || [1, 2];
  let value = rndBetween(range[0], range[1]) * scale;

  // Atributos inteiros são arredondados; os fracionários mantêm 2 casas.
  if (key === "attackSpeed" || key === "lifeRegen") {
    return Math.round(value * 100) / 100;
  }
  return Math.max(1, Math.round(value));
}

// Gera os modificadores de um item conforme seu tipo e tier (poder).
export function generateItemStats(type, tier) {
  const table = STAT_TABLE[type] || STAT_TABLE.ring;
  const safeTier = Math.max(1, tier || 1);
  const scale = 1 + (safeTier - 1) * 0.5;

  const attributes = emptyAttributes();

  // Atributo principal: sempre presente e com bônus reforçado.
  attributes[table.primary] += rollValue(table.primary, scale * 1.3);

  // Atributos secundários: de 0 a 2, sem repetir.
  const pool = table.secondary.slice();
  const extras = Math.floor(Math.random() * 3); // 0, 1 ou 2
  for (let i = 0; i < extras && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const key = pool.splice(idx, 1)[0];
    attributes[key] += rollValue(key, scale);
  }

  return {
    attributes,
    tier: safeTier,
    primary: table.primary,
  };
}
