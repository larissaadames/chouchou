// ─── Cozinha / Laboratório ────────────────────────────────────────────────────
// Cômodo onde o Chouchou se alimenta de elementos químicos.
// Usa os sprites de fundo e a máquina de elementos carregados em
// ChouchouLoader.js (SPRITES_CENARIO).
// ──────────────────────────────────────────────────────────────────────────────

class Cozinha {
  constructor(chouchou) {
    this.nome     = 'Laboratório'
    this.chouchou = chouchou
    this.food     = new FoodSystem(chouchou)
  }

  update() {
    this.food.update()
  }

  draw() {
    // ── Camada 1: fundo do laboratório (PNG 1080×720) ─────────────────────────
    if (SPRITES_CENARIO.laboratorio) {
      imageMode(CORNER)
      image(SPRITES_CENARIO.laboratorio, 0, 0, width, height)
    } else {
      // Fallback enquanto o PNG não carrega
      background('#1a2a1a')
    }

    // ── Camada 2: Chouchou (atrás da máquina) ─────────────────────────────────
    this.chouchou.draw()

    // ── Camada 3: máquina de elementos (centro superior, abaixo da HUD) ───────
    // A HUD do topo tem 66px, então a máquina começa em y=66.
    // Dimensões originais: 433×231 — desenhada em tamanho real.
    if (SPRITES_CENARIO.maquinaElement) {
      imageMode(CENTER)
      image(
        SPRITES_CENARIO.maquinaElement,
        width / 2,          // centro horizontal
        66 + 231 / 2,       // topo da HUD + metade da altura da máquina
        433, 231
      )
    }

    // ── Camada 4: FoodSystem (elemento ativo + menu da máquina) ───────────────
    // Desenhado por cima de tudo para ficar sempre clicável/visível.
    this.food.draw()
  }

  mousePressed() {
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
