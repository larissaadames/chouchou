// ─── Chouchou ─────────────────────────────────────────────────────────────────
// Classe principal do personagem.
// Gerencia estado, animação, cor e renderização em camadas.
// ──────────────────────────────────────────────────────────────────────────────

class Chouchou {
  constructor() {
    // ── Posição (centralizado na tela) ──────────────────────────────────────
    this.x = 0 // definido no setup depois que o canvas existe
    this.y = 0

    // ── Cor do corpo (usuário pode personalizar) ─────────────────────────────
    // Corpo é desenhado em branco/cinza claro no PNG;
    // o tint() aplica essa cor por cima.
    this.cor = { r: 50, g: 170, b: 50} // bege-dourado padrão

    // ── Estado atual ─────────────────────────────────────────────────────────
    // Controla qual animação e expressão estão ativos.
    // Valores válidos: 'idle' | 'feliz' | 'comendo' | 'triste' | 'dormindo'
    this.estado = 'idle'

    // ── Animação de frames ───────────────────────────────────────────────────
    this.frameAtual   = 0  // índice do frame atual dentro do array do estado
    this.frameTimer   = 0  // contador interno
    this.frameDuracao = 12 // quantos ticks do p5 cada frame fica visível (menor = mais rápido)

    // ── Sprites (preenchidos pelo ChouchouLoader) ────────────────────────────
    this.sprites = {
      // corpo: um array de imagens por estado (frames da animação)
      // ex: { idle: [img1, img2], feliz: [img1], ... }
      corpo: {
        idle:     [],
        feliz:    [],
        comendo:  [],
        triste:   [],
        dormindo: [],
      },

      // expressao: uma única imagem por estado (olhos, boca, etc.)
      // desenhada por cima do corpo, SEM tint (mantém cores originais)
      expressao: {
        idle:     null,
        feliz:    null,
        comendo:  null,
        triste:   null,
        dormindo: null,
      },

      // roupa: uma imagem opcional desenhada por cima de tudo
      roupa: null,
    }
  }

  // ── Inicializa posição após o canvas ser criado ───────────────────────────
  inicializar() {
    this.x = width  / 2
    this.y = height / 2
  }

  // ── Troca de estado ───────────────────────────────────────────────────────
  // Reinicia a animação quando o estado muda.
  setEstado(novoEstado) {
    if (this.estado === novoEstado) return
    this.estado     = novoEstado
    this.frameAtual = 0
    this.frameTimer = 0
  }

  // ── Troca de cor do corpo ─────────────────────────────────────────────────
  setCor(r, g, b) {
    this.cor = { r, g, b }
  }

  // ── Troca de roupa ────────────────────────────────────────────────────────
  setRoupa(imgRoupa) {
    this.sprites.roupa = imgRoupa
  }

  // ── Update (lógica de animação) ───────────────────────────────────────────
  // Chamado a cada frame pelo cômodo ativo.
  update() {
    const frames = this.sprites.corpo[this.estado] ?? []
    if (frames.length === 0) return // sem sprites ainda, nada a animar

    this.frameTimer++
    if (this.frameTimer >= this.frameDuracao) {
      this.frameTimer = 0
      this.frameAtual = (this.frameAtual + 1) % frames.length
    }
  }

  // ── Draw (renderização em camadas) ────────────────────────────────────────
  // Ordem: corpo → expressão → roupa
  draw() {
    push()
    imageMode(CENTER)

    // ── Camada 1: corpo com cor do usuário ──────────────────────────────────
    const frames = this.sprites.corpo[this.estado] ?? []
    if (frames.length > 0) {
      tint(this.cor.r, this.cor.g, this.cor.b)
      image(frames[this.frameAtual], this.x, this.y)
      noTint()
    } else {
      // Placeholder geométrico enquanto os PNGs não existem
      this._placeholder()
    }

    // ── Camada 2: expressão (sem tint — cores originais do PNG) ────────────
    const expressao = this.sprites.expressao[this.estado]
    if (expressao) {
      image(expressao, this.x, this.y)
    }

    // ── Camada 3: roupa por cima de tudo ───────────────────────────────────
    if (this.sprites.roupa) {
      image(this.sprites.roupa, this.x, this.y)
    }

    pop()
  }

  // ── Placeholder ───────────────────────────────────────────────────────────
  // Desenhado enquanto os sprites reais não foram criados ainda.
  // Representa o Chouchou com formas simples do p5.js.
  _placeholder() {
    const { r, g, b } = this.cor
    const x = this.x
    const y = this.y

    noStroke()

    // Corpo principal
    fill(r, g, b)
    ellipse(x, y, 130, 130)

    // Orelhinhas
    ellipse(x - 42, y - 52, 30, 30)
    ellipse(x + 42, y - 52, 30, 30)

    // Olhos (brancos)
    fill(255)
    ellipse(x - 22, y - 8, 28, 32)
    ellipse(x + 22, y - 8, 28, 32)

    // Pupilas
    fill(30)
    ellipse(x - 18, y - 6, 14, 18)
    ellipse(x + 26, y - 6, 14, 18)

    // Reflexo dos olhos
    fill(255)
    ellipse(x - 14, y - 10, 5, 5)
    ellipse(x + 30, y - 10, 5, 5)

    // Boca (estado define a expressão)
    this._bocaPlaceholder(x, y)
  }

  _bocaPlaceholder(x, y) {
    noFill()
    strokeWeight(3)

    switch (this.estado) {
      case 'feliz':
        // sorriso largo
        stroke(80, 40, 20)
        arc(x, y + 18, 50, 36, 0, PI)
        break

      case 'triste':
        // boca virada para baixo
        stroke(80, 40, 20)
        arc(x, y + 36, 50, 36, PI, TWO_PI)
        break

      case 'comendo':
        // boca aberta
        noStroke()
        fill(80, 40, 20)
        ellipse(x, y + 22, 30, 24)
        break

      case 'dormindo':
        // olhos fechados (linhas) + boca neutra
        stroke(80, 40, 20)
        strokeWeight(3)
        // sobrescreve os olhos com linhas fechadas
        fill(this.cor.r, this.cor.g, this.cor.b)
        noStroke()
        ellipse(x - 22, y - 8, 28, 32)
        ellipse(x + 22, y - 8, 28, 32)
        stroke(80, 40, 20)
        line(x - 32, y - 8, x - 10, y - 8)
        line(x + 10, y - 8, x + 34, y - 8)
        // ZZZ
        noStroke()
        fill(180, 180, 255)
        textSize(14)
        textAlign(LEFT, CENTER)
        text('z z z', x + 36, y - 30)
        break

      default:
        // idle — boca neutra
        stroke(80, 40, 20)
        line(x - 12, y + 22, x + 12, y + 22)
        break
    }

    noStroke()
    strokeWeight(1)
    textAlign(CENTER, CENTER) // restaura alinhamento padrão
  }
}
