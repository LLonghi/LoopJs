export function Elements() {
  return {
    stats: {
      life: $(".life-stat-progressbar"),
      exp: $(".exp-stat-progressbar"),
      day: $(""),
      boss: $(""),
      round: $(""),
      loop: $(".cnt-sidebar-counter"),
    },
    table: $(".cnt-table"),
    cardBox: $(".cnt-cards"),
    inventory: $(".cnt-sidebar-inventory .cnt-item-tile"),
    hero: null,
  };
}
