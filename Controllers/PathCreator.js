var tilePath = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
  [-1, 0, -1, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];
var matrixPath = [];
var tentativas = 0;
var rodada = 0;
var campfire = {
  l: 1,
  c: 1,
};

function log(arr) {
  console.log("");
  arr.forEach((c, i) => {
    var _ = i + " |";
    c.forEach((v) => {
      _ += " " + (v >= 0 ? ` ${v}` : v);
    });
    console.log(_);
  });
}

function checkTile(path) {
  if (path.l < 0 || path.c < 0 || path.l > 19 || path.c > 19) return false;
  return tilePath[path.l][path.c] == 0; // || ( rodada > 1 && path.l == campfire.l && path.c == campfire.c)
}

function checkCampfire(path) {
  if (path.l < 0 || path.c < 0 || path.l > 19 || path.c > 19) return false;
  return rodada > 1 && path.l == campfire.l && path.c == campfire.c; //
}
//provavelmente terei que utilizar recursividade pra ir voltando o caminho quando der merda e tentar a outra possibilidade, até que no fim ele se conecte
function createPath(path, lastPath) {
  var possiblePath = [];
  var success = false;


  if (!lastPath) {
    tilePath = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, -1, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];
    matrixPath = [];
    rodada = 0;
    console.log("tentativa: " + tentativas);
    tentativas++;
  }

  tilePath[path.l][path.c] = 1;

  matrixPath.push(path);

  //gambiarra
  if (rodada == 2) {
    tilePath[1][2] = 0;
    tilePath[1][3] = 0;
    tilePath[2][3] = 0;
  }

  var tileCheck = {
    l: path.l - 1,
    c: path.c
  };
  if (checkTile(tileCheck)) possiblePath.push(tileCheck);
  success = success ? success : checkCampfire(tileCheck);

  tileCheck = {
    l: path.l + 1,
    c: path.c,
  };
  if (checkTile(tileCheck)) possiblePath.push(tileCheck);
  success = success ? success : checkCampfire(tileCheck);

  tileCheck = {
    l: path.l,
    c: path.c - 1,
  };
  if (checkTile(tileCheck)) possiblePath.push(tileCheck);
  success = success ? success : checkCampfire(tileCheck);

  tileCheck = {
    l: path.l,
    c: path.c + 1,
  };
  if (checkTile(tileCheck)) possiblePath.push(tileCheck);
  success = success ? success : checkCampfire(tileCheck);

  if (success) {
    console.log("success!");
    return matrixPath.length>= 20? matrixPath: createPath(campfire);
  }
  //verificar de alguma forma se o prox é o campfire
  var campfireIndex = possiblePath.indexOf(campfire);
  var selected =
    campfireIndex > -1
      ? possiblePath[campfireIndex]
      : possiblePath[Math.floor(Math.random() * possiblePath.length)];

  if (selected) {
    if (JSON.stringify(path) != JSON.stringify(campfire))
      possiblePath
        .filter((x) => x != selected)
        .forEach((bpath) => {
          tilePath[bpath.l][bpath.c] = -1;
        });

    //talvez resolva se verificar se o selected ainda possui uma ligação com o inicio dps de bloqueado os caminhos
    //possa resolver pela possibilidade de voltar atras

    if (
      lastPath &&
      matrixPath.length > 1 &&
      JSON.stringify(path) == JSON.stringify(campfire)
    ) {
      console.log("sucesso");
      return matrixPath.length>= 20? matrixPath: createPath(campfire);
    } else {
      rodada++;
      return createPath(selected, path);
    }
  } else {
    log(tilePath);
    tilePath = [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, 0, -2, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, -1, -2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,-1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    ];
    matrixPath = [];
    rodada = 0;
    console.log("tentativa: " + tentativas);
    tentativas++;
    return createPath(campfire);
  }
}

//Este codigo ainda é impreciso, pode levar uma tentativa ou 100, o melhor seria seguir o caminho de desfazer os passos

export function PathCreator() {
  return {
    generate: function (current, max) {
      var successoPath = createPath(campfire);

      console.log(
        "_______________________________________________________________"
      );

      log(tilePath);
      console.log("erros antes do resultado: " + tentativas);
      console.log(matrixPath);

      return successoPath;
    },
  };
}
