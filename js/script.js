var games = [
  {
    title: "Game 1",
    descr:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    img: "./img/game-1.png",
    thumb: "./img/thumb1.png",
  },
  {
    title: "Game 2",
    descr:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    img: "./img/galaxy-serv-1.jpg",
    thumb: "./img/thumb1.png",
  },
  {
    title: "Game 3",
    descr:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    img: "./img/logo.png",
    thumb: "./img/thumb1.png",
  },
];

$(document).ready(function () {
  const elementos = $(".scroll-fade");

  // Verifica se o elemento entrou na área visível
  const observer = new IntersectionObserver(function (entradas, observer) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        $(entrada.target).addClass("show"); // Adiciona a classe .show
      }
    });
  });

  // Observar cada um dos elementos
  elementos.each(function () {
    observer.observe(this);
  });
});

function abrirModal(el) {
  $("#My-Modal .modal-title").text(games[$(el).data("game-id")].title);
  $("#modal-game-desc").text(games[$(el).data("game-id")].descr);
  $("#modal-game-img").attr("src", games[$(el).data("game-id")].img);
}
