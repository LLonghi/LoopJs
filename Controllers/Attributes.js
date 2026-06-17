// Fonte única de verdade dos atributos do jogo (herói, itens e mobs).
// Cada atributo tem um rótulo (PT-BR) e regras de formatação para a UI.

export const ATTRIBUTES = [
  { key: "maxLife", label: "Vida", percent: false, decimals: 0 },
  { key: "attack", label: "Ataque", percent: false, decimals: 0 },
  { key: "defense", label: "Defesa", percent: false, decimals: 0 },
  { key: "attackSpeed", label: "Vel. Ataque", percent: false, decimals: 2 },
  { key: "critChance", label: "Crítico", percent: true, decimals: 0 },
  { key: "evasion", label: "Esquiva", percent: true, decimals: 0 },
  { key: "vampirism", label: "Vampirismo", percent: true, decimals: 0 },
  { key: "lifeRegen", label: "Regen.", percent: false, decimals: 1 },
];

const ATTR_BY_KEY = ATTRIBUTES.reduce((acc, a) => {
  acc[a.key] = a;
  return acc;
}, {});

export function getAttributeMeta(key) {
  return ATTR_BY_KEY[key];
}

// Objeto com todos os atributos zerados.
export function emptyAttributes() {
  const obj = {};
  ATTRIBUTES.forEach((a) => (obj[a.key] = 0));
  return obj;
}

// Soma "b" dentro de "a" (mutando "a") e retorna "a".
export function addAttributes(a, b) {
  if (!b) return a;
  ATTRIBUTES.forEach((attr) => {
    a[attr.key] += b[attr.key] || 0;
  });
  return a;
}

// Soma uma lista de conjuntos de atributos em um novo objeto.
export function sumAttributes(list) {
  const total = emptyAttributes();
  (list || []).forEach((attrs) => addAttributes(total, attrs));
  return total;
}

// Formata um valor para exibição (ex.: "+12", "+5%", "1.20").
export function formatAttribute(key, value, withSign) {
  const meta = ATTR_BY_KEY[key];
  const decimals = meta ? meta.decimals : 0;
  const rounded = Number(value).toFixed(decimals);
  const sign = withSign && value > 0 ? "+" : "";
  return `${sign}${rounded}${meta && meta.percent ? "%" : ""}`;
}
