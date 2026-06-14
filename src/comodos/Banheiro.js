// ─── Banheiro ─────────────────────────────────────────────────────────────────
// Cômodo de higiene — futuramente terá o minigame de banho.
// ──────────────────────────────────────────────────────────────────────────────

class Banheiro {
  constructor(chouchou) {
    this.nome     = 'Banheiro'
    this.chouchou = chouchou
  }

  update() {}

  draw() {
    // ── Fundo ───────────────────────────────────────────────────────────────
    background('#1a2a2d')

    // Parede
    noStroke()
    fill('#1e3236')
    rect(0, 0, width, height * 0.72)

    // ── Chão ────────────────────────────────────────────────────────────────
    fill('#1a3a40')
    rect(0, height * 0.72, width, height * 0.28)
    fill('#154045')
    rect(0, height * 0.72, width, 6)

    // Azulejos (brancos com detalhe azul)
    stroke('#2a4a50')
    strokeWeight(1)
    for (let x = 0; x < width; x += 44) {
      line(x, 70, x, height * 0.58)
    }
    for (let y = 70; y < height * 0.58; y += 44) {
      line(0, y, width, y)
    }
    noStroke()
    // Detalhes decorativos nos azulejos
    fill('#1e4a52')
    for (let x = 22; x < width; x += 44) {
      for (let y = 92; y < height * 0.58; y += 44) {
        rect(x - 6, y - 6, 12, 12, 2)
      }
    }

    // ── Banheira ──────────────────────────────────────────────────────────────
    // Estrutura externa
    fill('#d0e8ec')
    rect(width/2 - 100, height * 0.5, 200, 100, 20)
    // Interior (água)
    fill('#4ab8cc')
    rect(width/2 - 90, height * 0.515, 180, 72, 14)
    // Reflexo da água
    fill(255, 255, 255, 40)
    rect(width/2 - 80, height * 0.525, 100, 8, 6)
    // Torneira
    fill('#a0c0c8')
    rect(width/2 - 10, height * 0.49, 20, 20, 4)
    fill('#80a0a8')
    rect(width/2 - 4, height * 0.47, 8, 20, 3)

    // ── Espelho + pia ─────────────────────────────────────────────────────────
    // Espelho
    fill('#0a1a1e')
    rect(width - 120, height * 0.12, 100, 80, 6)
    fill('#0f2a30')
    rect(width - 116, height * 0.125, 92, 72, 4)
    // Brilho do espelho
    fill(255, 255, 255, 15)
    rect(width - 112, height * 0.13, 40, 60, 3)

    // Pia
    fill('#d0e8ec')
    ellipse(width - 70, height * 0.245, 90, 40)
    fill('#b0c8cc')
    ellipse(width - 70, height * 0.25, 70, 28)

    // ── Chouchou ──────────────────────────────────────────────────────────────
    this.chouchou.draw()
  }

  mousePressed() {
    const d = dist(mouseX, mouseY, this.chouchou.x, this.chouchou.y)
    if (d < 70) {
      this.chouchou.setEstado('feliz')
      setTimeout(() => this.chouchou.setEstado('idle'), 2000)
    }
  }
}
