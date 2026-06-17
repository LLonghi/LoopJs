// Gera um loop de estrada aleatório como um "ciclo induzido" na grade:
// - o caminho volta ao ponto de partida (loop fechado);
// - nenhuma rua encosta em outra rua, exceto as células consecutivas do caminho;
// - mantém uma margem livre entre a rua e as bordas da grade.
// Usa backtracking (DFS) em vez de reiniciar do zero a cada beco sem saída,
// o que torna a geração performática e confiável.

const ROWS = 10;
const COLS = 20;
const MARGIN = 1; // tiles livres garantidos entre a rua e a borda da grade
const MIN_LEN = 20; // tamanho mínimo do loop (mesma regra do gerador antigo)
const MAX_LEN = 70; // teto para evitar loops gigantes que tomam a grade toda
const MAX_ATTEMPTS = 200; // reinícios com novo ponto inicial
const STEP_BUDGET = 4000; // teto de passos por tentativa (evita backtracking exponencial)

const RMIN = MARGIN;
const RMAX = ROWS - 1 - MARGIN;
const CMIN = MARGIN;
const CMAX = COLS - 1 - MARGIN;

const DIRS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function key(l, c) {
  return l + "-" + c;
}

function inArea(l, c) {
  return l >= RMIN && l <= RMAX && c >= CMIN && c <= CMAX;
}

function isAdjacent(a, b) {
  return Math.abs(a.l - b.l) + Math.abs(a.c - b.c) === 1;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

// Conta quantas células vizinhas (4-direções) já fazem parte do caminho.
function roadNeighborCount(l, c, road) {
  let count = 0;
  for (let i = 0; i < DIRS.length; i++) {
    if (road.has(key(l + DIRS[i][0], c + DIRS[i][1]))) count++;
  }
  return count;
}

function tryBuildLoop() {
  const start = {
    l: RMIN + Math.floor(Math.random() * (RMAX - RMIN + 1)),
    c: CMIN + Math.floor(Math.random() * (CMAX - CMIN + 1)),
  };

  const path = [start];
  const road = new Set([key(start.l, start.c)]);
  let steps = 0;

  function extend() {
    if (++steps > STEP_BUDGET) return null; // aborta tentativa cara; generate() reinicia
    const current = path[path.length - 1];
    const len = path.length;

    if (len > MAX_LEN) return null;

    // Probabilidade de fechar cresce conforme o loop fica mais longo,
    // gerando loops de tamanhos variados em vez de sempre o mínimo.
    const closeProb =
      len >= MIN_LEN ? (len - MIN_LEN) / (MAX_LEN - MIN_LEN) : 0;

    const extensions = [];
    let closingCell = null;

    for (let i = 0; i < DIRS.length; i++) {
      const nl = current.l + DIRS[i][0];
      const nc = current.c + DIRS[i][1];

      if (!inArea(nl, nc)) continue;
      if (road.has(key(nl, nc))) continue;

      const candidate = { l: nl, c: nc };
      const touching = roadNeighborCount(nl, nc, road); // inclui sempre "current"

      // Primeiro passo: a célula vizinha do start é o início legítimo do caminho.
      if (len === 1) {
        if (touching === 1) extensions.push(candidate);
        continue;
      }

      if (isAdjacent(candidate, start)) {
        // Só pode ser a célula de fechamento: deve tocar apenas "current" e "start".
        if (touching === 2 && len + 1 >= MIN_LEN) closingCell = candidate;
        continue;
      }

      // Passo normal: a nova célula só pode encostar em "current".
      if (touching === 1) extensions.push(candidate);
    }

    // Fecha o loop (cedo se for sorteado, ou obrigatoriamente se não há mais saída).
    if (closingCell && (extensions.length === 0 || Math.random() < closeProb)) {
      path.push(closingCell);
      return path.slice();
    }

    shuffle(extensions);
    for (let i = 0; i < extensions.length; i++) {
      const next = extensions[i];
      const k = key(next.l, next.c);
      path.push(next);
      road.add(k);

      const result = extend();
      if (result) return result;

      path.pop();
      road.delete(k);
    }

    // Não conseguiu estender nem fechar aqui: tenta fechar como última opção.
    if (closingCell) {
      path.push(closingCell);
      return path.slice();
    }

    return null;
  }

  return extend();
}

export function PathCreator() {
  return {
    generate: function () {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const loop = tryBuildLoop();
        if (loop && loop.length >= MIN_LEN) return loop;
      }
      // Fallback extremamente improvável: retângulo simples dentro da margem.
      return fallbackRectangleLoop();
    },
  };
}

// Loop retangular garantido (só usado se o gerador aleatório falhar repetidamente).
function fallbackRectangleLoop() {
  const top = RMIN;
  const bottom = RMAX;
  const left = CMIN;
  const right = CMAX;
  const loop = [];

  for (let c = left; c <= right; c++) loop.push({ l: top, c });
  for (let l = top + 1; l <= bottom; l++) loop.push({ l, c: right });
  for (let c = right - 1; c >= left; c--) loop.push({ l: bottom, c });
  for (let l = bottom - 1; l > top; l--) loop.push({ l, c: left });

  return loop;
}
