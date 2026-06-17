import { setSpeedMultiplier } from "./Configs.js";

// Controles de tempo no cabeçalho:
// - botões x1 / x2 ajustam a velocidade do jogo em tempo real;
// - a ampulheta "pula o dia": simula toda a rota até a fogueira de uma vez.
export function TimeControls() {
  let selectedSpeed = 1;

  function applySpeed() {
    setSpeedMultiplier(selectedSpeed);
    $(".speed-btn").each(function () {
      $(this).toggleClass(
        "active",
        Number($(this).data("speed")) === selectedSpeed
      );
    });
  }

  return {
    init: function () {
      $(".speed-btn").on("click", function () {
        selectedSpeed = Number($(this).data("speed")) || 1;
        applySpeed();
      });

      $(".time-skip").on("click", function () {
        const btn = $(this);
        btn.addClass("active");
        try {
          controllers.World.skipDay();
        } catch (e) {
          console.log("Não foi possível pular o dia ainda.", e);
        }
        setTimeout(() => btn.removeClass("active"), 200);
      });

      applySpeed();
    },
  };
}
