// ─── Quarto ───────────────────────────────────────────────────────────────────
// Primeiro cômodo — onde o Chouchou passa a maior parte do tempo.
// ──────────────────────────────────────────────────────────────────────────────

class Quarto {
  constructor(chouchou) {
    this.nome      = 'Quarto'
    this.chouchou  = chouchou
  }

  update() {}

  draw() {
    // ── Fundo ───────────────────────────────────────────────────────────────
    background('#1a1a2e')

    // Parede com gradiente simulado
    noStroke()
    fill('#16213e')
    rect(0, 0, width, height * 0.72)

    // ── Chão ────────────────────────────────────────────────────────────────
    fill('#2d2250')
    rect(0, height * 0.72, width, height * 0.28)

    // Rodapé
    fill('#3d3060')
    rect(0, height * 0.72, width, 6)

    // ── Cama (canto esquerdo) ────────────────────────────────────────────────
    // Estrutura
    fill('#3a2a60')
    rect(20, height * 0.52, 150, 100, 8)
    // Cabeceira
    fill('#4a3a78')
    rect(20, height * 0.52, 150, 32, 8)
    // Travesseiro
    fill('#e8d5f0')
    rect(30, height * 0.535, 60, 22, 6)
    // Cobertor
    fill('#7c3aed')
    rect(20, height * 0.565, 150, 55, 0, 0, 8, 8)
    // Detalhe do cobertor
    fill('#6d28d9')
    rect(20, height * 0.565, 150, 12, 0)

    // ── Janela (canto direito) ────────────────────────────────────────────────
    fill('#0a0a1e')
    rect(width - 110, height * 0.12, 90, 110, 6)
    // Céu noturno
    fill('#0f0f3a')
    rect(width - 106, height * 0.125, 82, 102, 4)
    // Lua
    fill('#f0e68c')
    ellipse(width - 78, height * 0.175, 28, 28)
    fill('#0f0f3a')
    ellipse(width - 70, height * 0.17, 24, 24)
    // Estrelinha
    fill('#f0e68c')
    ellipse(width - 50, height * 0.19, 4, 4)
    ellipse(width - 105, height * 0.21, 3, 3)
    // Grade da janela
    stroke('#2a1a50')
    strokeWeight(2)
    line(width - 65, height * 0.125, width - 65, height * 0.225)
    line(width - 106, height * 0.175, width - 24, height * 0.175)
    noStroke()

    // ── Tapete ────────────────────────────────────────────────────────────────
    fill('#4a1d8a')
    ellipse(width / 2, height * 0.78, 220, 70)
    fill('#5b2d9e')
    ellipse(width / 2, height * 0.78, 180, 52)

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
