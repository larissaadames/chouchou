// ─── ChouchouLoader ───────────────────────────────────────────────────────────
// Responsável por carregar todos os sprites e injetá-los na instância Chouchou.
// Chamado dentro do preload() do p5.js, antes do setup().
//
// Como usar quando os PNGs estiverem prontos:
//   Substitua o array vazio [] por loadImage('caminho/do/arquivo.png')
//   Ex: idle: [ loadImage('assets/sprites/corpo/idle_01.png'),
//               loadImage('assets/sprites/corpo/idle_02.png') ]
// ──────────────────────────────────────────────────────────────────────────────

function carregarSpritesChouchou(chouchou) {

  // ── Corpo (base branca/cinza — cor aplicada via tint) ─────────────────────
  // Cada estado tem um array de frames para animação.
  // Um único frame = personagem estático naquele estado.
  chouchou.sprites.corpo = {
    idle:       [loadImage('assets/sprites/corpo/idle01.png')],
    feliz:      [loadImage('assets/sprites/corpo/idle01.png')],
    bocaAberta: [loadImage('assets/sprites/corpo/idle01.png')], // boca aberta esperando a comida
    comendo:    [loadImage('assets/sprites/corpo/idle01.png')], // frame 1 mastigando
    // quando ccComendo2.png existir, adicione:
    // comendo: [loadImage('assets/sprites/corpo/idle01.png'),
    //           loadImage('assets/sprites/corpo/idle01.png')],
    triste:     [loadImage('assets/sprites/corpo/idle01.png')],
    dormindo:   [loadImage('assets/sprites/corpo/idle01.png')],
  }

  chouchou.sprites.expressao = {
    idle:       loadImage('assets/sprites/expressoes/ccBravo.png'),
    feliz:      loadImage('assets/sprites/expressoes/ccFeliz.png'),
    bocaAberta: loadImage('assets/sprites/expressoes/ccBocaAberta.png'), // boca aberta
    comendo: [ loadImage('assets/sprites/expressoes/ccBocaAberta.png'), // boca aberta
              loadImage('assets/sprites/expressoes/ccBocaFechada.png')], // boca fechada, // mastigando
    // quando ccComendo2.png existir:
    // comendo usa frameAtual para alternar corpo, mas expressão é única por estado.
    // Para alternar expressão também, usaremos sprites.expressaoFrames no futuro.
    triste:     loadImage('assets/sprites/expressoes/ccMal.png'),
    dormindo:   null,
  }

  // ── Roupa (opcional — desenhada por cima de tudo) ─────────────────────────
  chouchou.sprites.roupa = null,// ex: loadImage('assets/sprites/roupas/pijama.png')

  chouchou.sprites.chapeu = null // ex: loadImage('assets/sprites/acessorios/chapeu.png')
}

function carregarElementos() {
  CATALOGO_COMIDAS.nitrogenio.imagem = loadImage('assets/sprites/elementos/nitrogenio_N.png')
  // futuros elementos aqui
}
