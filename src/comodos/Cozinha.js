// ─── Cozinha ──────────────────────────────────────────────────────────────────
// Cômodo onde o Chouchou se alimenta de elementos químicos.
// A lógica de comida vive inteiramente no FoodSystem — a Cozinha só
// inicializa, delega update/draw/eventos e desenha o cenário.
// ──────────────────────────────────────────────────────────────────────────────

class Cozinha {
  constructor(chouchou) {
    this.nome      = 'Cozinha'
    this.chouchou  = chouchou
    this.food      = new FoodSystem(chouchou)
  }

  update() {
    this.food.update()
  }

  draw() {
    // ── Fundo ───────────────────────────────────────────────────────────────
    background('#1a2a1a')

    noStroke()
    fill('#1e3320')
    rect(0, 0, width, height * 0.72)

    // ── Chão ────────────────────────────────────────────────────────────────
    fill('#2a3d1e')
    rect(0, height * 0.72, width, height * 0.28)
    fill('#1a2a10')
    rect(0, height * 0.72, width, 6)

    // Azulejos (parede)
    stroke('#2e4a28')
    strokeWeight(1)
    for (let x = 0; x < width; x += 40) line(x, 70, x, height * 0.58)
    for (let y = 70; y < height * 0.58; y += 40) line(0, y, width, y)
    noStroke()

    // ── Balcão ───────────────────────────────────────────────────────────────
    fill('#3d5c2a')
    rect(0, height * 0.58, width, 70)
    fill('#4a7033')
    rect(0, height * 0.58, width, 8)

    // ── Armários ─────────────────────────────────────────────────────────────
    fill('#2e4a20')
    rect(0, 70, width * 0.4, 90, 0, 0, 6, 6)
    fill('#3a5c28')
    rect(4, 74, width * 0.4 - 8, 82, 4)
    fill('#c0a060')
    rect(width * 0.4 - 24, 70 + 41, 16, 8, 4)

    fill('#2e4a20')
    rect(width * 0.65, 70, width * 0.35, 90, 0, 0, 6, 6)
    fill('#3a5c28')
    rect(width * 0.65 + 4, 74, width * 0.35 - 8, 82, 4)
    fill('#c0a060')
    rect(width * 0.65 + 14, 70 + 41, 16, 8, 4)

    // ── Fogão ────────────────────────────────────────────────────────────────
    fill('#1e3318')
    rect(width/2 - 60, height * 0.47, 120, 90, 6)
    fill('#0a1a08')
    ellipse(width/2 - 26, height * 0.505, 34, 34)
    ellipse(width/2 + 26, height * 0.505, 34, 34)
    fill('#e94560')
    ellipse(width/2 - 26, height * 0.505, 16, 16)
    ellipse(width/2 + 26, height * 0.505, 16, 16)
    fill('#f59e0b')
    ellipse(width/2 - 26, height * 0.505, 8, 8)
    ellipse(width/2 + 26, height * 0.505, 8, 8)

    // ── Chouchou ──────────────────────────────────────────────────────────────
    this.chouchou.draw()

    // ── FoodSystem (geladeira + menu + item ativo) ────────────────────────────
    // Desenhado por cima do cenário e do Chouchou para ficar sempre visível
    this.food.draw()
  }

  mousePressed() {
    // Toque no Chouchou
    if (this.chouchou.foiTocado(mouseX, mouseY)) {
      this.chouchou.tocar()
      return
    }
    this.food.mousePressed()
  }

  mouseReleased() {
    this.food.mouseReleased()
  }
}
