// ─── Quarto ───────────────────────────────────────────────────────────────────
// Primeiro cômodo — onde o Chouchou passa a maior parte do tempo.
// ──────────────────────────────────────────────────────────────────────────────

class SalaJogos {
  constructor(chouchou) {
    this.nome      = 'Sala de Jogos'
    this.chouchou  = chouchou
  }

  update() {}

  draw() {
    // ── Fundo ───────────────────────────────────────────────────────────────
    background('#f3bd48')

    // ── Chouchou ──────────────────────────────────────────────────────────────
    this.chouchou.draw()
  }

  mousePressed() {
    // Clicou no Chouchou? → delega para o método tocar()
    if (this.chouchou.foiTocado(mouseX, mouseY)) {
      this.chouchou.tocar()
    }
  }
}
