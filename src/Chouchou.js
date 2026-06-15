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
    this.cor = { r: 50, g: 100, b: 50} // bege-dourado padrão

    // ── Stats (fome, humor, saúde) ───────────────────────────────────────────
    // Cada stat vai de 0 (péssimo) a 100 (perfeito).
    // O decaimento por tempo vem na próxima etapa — por enquanto os valores
    // são fixos para que a HUD já apareça corretamente.
    this.stats = {
      fome:  { valor: 80, max: 100, cor: '#f97316', icone: '🍖' }, // laranja
      humor: { valor: 60, max: 100, cor: '#a855f7', icone: '⭐' }, // roxo
      hidratacao: { valor: 50, max: 100, cor: '#3b82f6', icone: '💧' }, // azul
      energia: { valor: 90, max: 100, cor: '#facc15', icone: '⚡' }, // amarelo
    }

    
    // ── Estado atual ─────────────────────────────────────────────────────────
    // Controla qual animação e expressão estão ativos.
    // Valores válidos: 'idle' | 'feliz' | 'bocaAberta' | 'comendo' | 'triste' | 'dormindo'
    this.estado = 'idle'

    // ── Animação de frames ───────────────────────────────────────────────────
    this.frameAtual   = 0
    this.frameTimer   = 0
    this.frameDuracao = 8 // 8 ticks por frame ≈ 0.13s a 60fps (bom para mastigação)

    // ── Sprites (preenchidos pelo ChouchouLoader) ────────────────────────────
    this.sprites = {
      corpo: {
        idle:       [],
        feliz:      [],
        bocaAberta: [], // comida está perto — boca aberta esperando
        comendo:    [], // mastigando — alterna entre frames
        triste:     [],
        dormindo:   [],
      },

      expressao: {
        idle:       null,
        feliz:      null,
        bocaAberta: null,
        comendo:    null,
        triste:     null,
        dormindo:   null,
      },

      // roupa: uma imagem opcional desenhada por cima de tudo
      roupa: null,

      // chapeu: uma imagem opcional desenhada por cima de tudo (acima da roupa)
      // Segue o mesmo padrão de roupa: null = sem chapéu
      chapeu: null,
    }
  }

  // ── Inicializa posição após o canvas ser criado ───────────────────────────
  inicializar() {
    this.x = width  / 2
    // Sobe um pouco do centro para não ficar escondido atrás da HUD de stats
    // (faixa de stats = 72px no rodapé, então deslocamos 36px para cima)
    this.y = height / 2 - 36
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

  // ── Troca de chapéu ───────────────────────────────────────────────────────
  // Passa null para remover o chapéu.
  setChapeu(imgChapeu) {
    this.sprites.chapeu = imgChapeu
  }

  // ── Interações ────────────────────────────────────────────────────────────

  // Verifica se um ponto (px, py) está sobre o corpo do Chouchou.
  // Raio de 90 = metade dos 180px de tamanho de exibição do sprite.
  foiTocado(px, py) {
    return dist(px, py, this.x, this.y) < 90
  }

  // Toque carinhoso — aumenta humor, reage visualmente.
  // Qualquer cômodo pode chamar isso no mousePressed().
  tocar() {
    this._alterarStat('humor', +12)
    this.setEstado('feliz')
    setTimeout(() => this.setEstado('idle'), 1500)
  }

  // ── Utilitário interno: altera um stat com segurança ─────────────────────
  // Garante que o valor nunca sai do intervalo [0, max].
  // Outros métodos de interação (alimentar, regar, etc.) vão usar isso também.
  _alterarStat(chave, quantidade) {
    const stat = this.stats[chave]
    if (!stat) return
    stat.valor = constrain(stat.valor + quantidade, 0, stat.max)
  }

  // ── Update (lógica de animação) ───────────────────────────────────────────
  // Chamado a cada frame pelo cômodo ativo.
  update() {
    const framesCorpo = this.sprites.corpo[this.estado] ?? []
    const framesExp   = this.sprites.expressao[this.estado]
    const totalFrames = Array.isArray(framesExp)
      ? Math.max(framesCorpo.length, framesExp.length)
      : framesCorpo.length

    if (totalFrames === 0) return

    this.frameTimer++
    if (this.frameTimer >= this.frameDuracao) {
      this.frameTimer = 0
      this.frameAtual = (this.frameAtual + 1) % totalFrames
    }
  }
  // ── Draw (renderização em camadas) ────────────────────────────────────────
  // Ordem: corpo → expressão → roupa → chapéu
  draw() {
    push()
    imageMode(CENTER)

    // Tamanho fixo de renderização — todos os sprites são desenhados
    // nesse tamanho independente da resolução do PNG.
    const S = 180

    // ── Camada 1: corpo com cor do usuário ──────────────────────────────────
    const frames = this.sprites.corpo[this.estado] ?? []
    if (frames.length > 0) {
      tint(this.cor.r, this.cor.g, this.cor.b)
      const frameIdx = this.frameAtual % frames.length
      image(frames[frameIdx], this.x, this.y, S, S)
      noTint()
    } else {
      // Placeholder geométrico enquanto os PNGs não existem
      this._placeholder()
    }

    // ── Camada 2: expressão (sem tint — cores originais do PNG) ────────────
    const expressao = this.sprites.expressao[this.estado]
    if (expressao) {
      // Se for array, alterna com frameAtual — senão usa direto
      const frame = Array.isArray(expressao)
        ? expressao[this.frameAtual % expressao.length]
        : expressao
      if (frame) image(frame, this.x, this.y, S, S)
    }

    // ── Camada 3: roupa por cima de tudo ───────────────────────────────────
    if (this.sprites.roupa) {
      image(this.sprites.roupa, this.x, this.y, S, S)
    }

    // ── Camada 4: chapéu (acima da roupa) ──────────────────────────────────
    if (this.sprites.chapeu) {
      image(this.sprites.chapeu, this.x, this.y, S, S)
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

      case 'bocaAberta':
      case 'comendo':
        // boca aberta (bocaAberta = esperando, comendo = mastigando)
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
