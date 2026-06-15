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
    // ── Camada 1: fundo do laboratório ────────────────────────────────────────
    if (SPRITES_CENARIO.laboratorio) {
      imageMode(CORNER)
      image(SPRITES_CENARIO.laboratorio, 0, 0, width, height)
    } else {
      background('#1a2a1a')
    }

    // ── Camada 2: Chouchou ────────────────────────────────────────────────────
    this.chouchou.draw()

    // ── Camada 3: FoodSystem (elemento ativo para arrastar) ───────────────────
    this.food.draw()
  }

  mousePressed() {
    // PRIORIDADE 1: Tenta interagir com a comida primeiro
    let interagiuComComida = this.food.mousePressed()

    // PRIORIDADE 2: Se não clicou na comida, verifica se tocou no Chouchou
    if (!interagiuComComida) {
      if (this.chouchou.foiTocado(mouseX, mouseY)) {
        this.chouchou.tocar()
      }
    }
  }

  mouseReleased() {
    this.food.mouseReleased()
  }
}