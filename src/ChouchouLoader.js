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
    idle:     [loadImage('assets/sprites/corpo/idle_01.png')], // ex: idle_01.png, idle_02.png (respiração suave)
    feliz:    [], // ex: feliz_01.png, feliz_02.png (pulando/vibrando)
    comendo:  [], // ex: comendo_01.png, comendo_02.png
    triste:   [], // ex: triste_01.png
    dormindo: [], // ex: dormindo_01.png, dormindo_02.png (olhos fechados)
  }

  // ── Expressões (olhos, boca — sem tint, cores originais) ──────────────────
  // Um PNG por estado, desenhado por cima do corpo.
  chouchou.sprites.expressao = {
    idle:     loadImage('assets/sprites/expressoes/idle.png'), // ex: loadImage('assets/sprites/expressoes/idle.png')
    feliz:    null,
    comendo:  null,
    triste:   null,
    dormindo: null,
  }

  // ── Roupa (opcional — desenhada por cima de tudo) ─────────────────────────
  chouchou.sprites.roupa = null // ex: loadImage('assets/sprites/roupas/pijama.png')
}
