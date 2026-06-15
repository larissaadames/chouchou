// ─── Jardim ───────────────────────────────────────────────────────────────────
// Cômodo externo onde o Chouchou pode ser hidratado com o regador.
// Mecânica: arrastar o regador até o Chouchou solta gotinhas e aumenta
// o stat de hidratação — inspirado no chuveiro do Pou original.
// ──────────────────────────────────────────────────────────────────────────────

class Jardim {
  constructor(chouchou) {
    this.nome     = 'Jardim'
    this.chouchou = chouchou

    // ── Regador ───────────────────────────────────────────────────────────────
    this.regador = {
      x:         90,   // posição inicial (canto esquerdo)
      y:         0,    // Definido dinamicamente no update() assim que a tela carrega
      origemX:   90,   // posição de repouso — para onde volta ao soltar
      origemY:   0,
      
      // Ajuste o tamanho visual da imagem aqui se ficar muito grande ou pequena
      visualW:   160,  // Largura visual do PNG
      visualH:   140,  // Altura visual do PNG
      
      arrastando: false,
    }

    // ── AJUSTE DO BICO DO REGADOR (Importante para as gotas) ───────────────────
    // Como trocamos a imagem, precisamos dizer ao p5 onde fica o bico
    // RELATIVO AO CENTRO da imagem.
    this.bicoOffset = {
      x: 75,  // Quantos pixels para a DIREITA do centro da imagem sai a água
      y: -20  // Quantos pixels para CIMA do centro da imagem sai a água
    }

    // Controle para inicializar as posições verticais uma única vez
    this._inicializado = false

    // ── Partículas de água ────────────────────────────────────────────────────
    this.gotas = []

    // Cooldown para não aumentar a hidratação a cada frame
    this._cooldown = 0
    
    // ── SISTEMA DE SÓIS (Energia) ──────────────────────────────────────────────
    this.sois = [];
    this.tempoUltimoSol = 0;
    this.intervaloSol = random(3000, 8000); // Aparece entre 3 e 8 segundos
  }

  update() {
    // Inicializa a altura de repouso do regador na primeira execução
    if (!this._inicializado && height > 0) {
      this.regador.y = height * 0.35
      this.regador.origemY = height * 0.35
      this._inicializado = true
    }

    // ── Atualização do Sol (Energia) ──
    let dt = min(deltaTime, 32);
    let estabilizador = dt / 16.66;

    this.tempoUltimoSol += dt;
    if (this.tempoUltimoSol >= this.intervaloSol) {
      this.gerarSol();
      this.tempoUltimoSol = 0;
      this.intervaloSol = random(3000, 8000); 
    }

    for (let i = this.sois.length - 1; i >= 0; i--) {
      let sol = this.sois[i];
      sol.y += sol.velocidade * estabilizador;
      sol.angulo += sol.velAngulo * estabilizador;
      
      // Apaga o sol se ele sair da tela
      if (sol.y > height + 80) {
        this.sois.splice(i, 1);
      }
    }

    // Segue o mouse enquanto arrasta
    if (this.regador.arrastando) {
      this.regador.x = mouseX
      this.regador.y = mouseY

      // ── Emite gotas quando o bico está acima do Chouchou ─────────────────
      const bico = this._posicaoBico()
      const dentroAlcance = dist(bico.x, bico.y, this.chouchou.x, this.chouchou.y - 100) < 180 // Aumentado um pouco o alcance

      if (dentroAlcance) {
        // Spawna 2 gotas por frame
        for (let i = 0; i < 3; i++) {
          this.gotas.push({
            x:     bico.x + random(-5, 5), // Menor dispersão
            y:     bico.y,
            vy:    random(4, 7), // Gotas ligeiramente mais rápidas
            alpha: 255,
          })
        }

        // Aumenta hidratação com cooldown (a cada 30 frames ≈ 0.5s)
        this._cooldown--
        if (this._cooldown <= 0) {
          this.chouchou._alterarStat('hidratação', +5)
          this.chouchou.setEstado('feliz')
          setTimeout(() => this.chouchou.setEstado('idle'), 800)
          this._cooldown = 30
        }
      }
    }

    // ── Atualiza gotas existentes ─────────────────────────────────────────
    for (const g of this.gotas) {
      g.y     += g.vy
      g.alpha -= 4
    }
    // Remove gotas invisíveis
    this.gotas = this.gotas.filter(g => g.alpha > 0)
  }

  gerarSol() {
    this.sois.push({
      x: random(80, width - 80),
      y: -60, 
      velocidade: random(1.5, 2.5), 
      tamanho: random(100, 150), 
      angulo: random(TWO_PI),
      velAngulo: random(0.01, 0.04) // Velocidade de rotação contínua
    });
  }

  draw() {
    // ── Camada 1: Fundo do Jardim ───────────────────────────────────────────
    if (SPRITES_CENARIO.jardim) {
      imageMode(CORNER)
      image(SPRITES_CENARIO.jardim, 0, 0, width, height)
    } else {
      background('#2e4a2e')
    }

    // ── Camada 2: Chouchou ──────────────────────────────────────────────────
    this.chouchou.draw()

    // ── Camada 3: Sóis Rotacionando (Energia) ────────────────────────────────
    for (let sol of this.sois) {
      push();
      translate(sol.x, sol.y);
      rotate(sol.angulo);
      imageMode(CENTER);

      // Se a imagem real do Sol existir, desenha-a. Se não, usa o fallback geométrico
      if (typeof SPRITES_OBJETOS !== 'undefined' && SPRITES_OBJETOS.sol) {
        image(SPRITES_OBJETOS.sol, 0, 0, sol.tamanho, sol.tamanho);
      } else {
        noStroke();
        fill('#fef08a'); 
        for (let r = 0; r < 8; r++) {
          rotate(TWO_PI / 8);
          ellipse(0, 35, 12, 24);
        }
        fill('#facc15'); 
        ellipse(0, 0, sol.tamanho, sol.tamanho);
      }
      pop();
    }

    // ── Camada 4: Gotas de água ─────────────────────────────────────────────
    noStroke()
    for (const g of this.gotas) {
      fill(96, 165, 250, g.alpha) // azul claro
      ellipse(g.x, g.y, 12, 18)
    }

    // ── Camada 5: Regador (IMAGEM) ─────────────────────────────────────────
    this._desenharRegador(this.regador.x, this.regador.y)

    // ── Dica inicial ──────────────────────────────────────────────────────
    if (!this.regador.arrastando && this.gotas.length === 0) {
      fill(255, 255, 255, 180)
      noStroke()
      textAlign(CENTER, CENTER)
      textSize(30)
      text('Arraste o regador até o Chuchu', width / 2, height * 0.88)
    }
  }

  // ── Desenha o regador usando o Sprite PNG ──────────────────────────────────
  _desenharRegador(x, y) {
    push()
    if (typeof SPRITES_OBJETOS !== 'undefined' && SPRITES_OBJETOS.regador) {
      imageMode(CENTER) 
      image(
        SPRITES_OBJETOS.regador,
        x,
        y,
        this.regador.visualW,
        this.regador.visualH
      )
    } else {
      rectMode(CENTER)
      fill('#38bdf8')
      rect(x, y, 100, 80, 8)
      fill(255)
      textSize(10)
      textAlign(CENTER, CENTER)
      text('PNG Faltando', x, y)
    }
    pop()
  }

  // ── Posição EXATA do bico do regador baseado na imagem ───────────────────
  _posicaoBico() {
    return { 
      x: this.regador.x + this.bicoOffset.x, 
      y: this.regador.y + this.bicoOffset.y 
    }
  }

  // ── Eventos de mouse ──────────────────────────────────────────────────────
  mousePressed() {
    // PRIORIDADE 1: Verifica se o jogador clicou num dos Sóis caindo
    for (let i = this.sois.length - 1; i >= 0; i--) {
      let sol = this.sois[i];
      if (dist(mouseX, mouseY, sol.x, sol.y) < sol.tamanho * 0.6) { // 0.6 para ajustar o raio de clique ao círculo central do sol
        // 1. Modifica o status do pet
        this.chouchou._alterarStat('energia', random(10, 25));
        this.chouchou.setEstado('feliz');
        setTimeout(() => this.chouchou.setEstado('idle'), 800);
        
        // 2. Toca o som de pegar o sol
        if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.sun_pickup) {
          SONS_CHOUCHOU.sun_pickup.play();
        }
        
        // 3. Destrói o objeto da tela
        this.sois.splice(i, 1);
        return true; 
      }
    }

    // PRIORIDADE 2: Verifica se clicou próximo ao corpo do regador para arrastar
    let raioClique = max(this.regador.visualW, this.regador.visualH) * 0.5
    if (dist(mouseX, mouseY, this.regador.x, this.regador.y) < raioClique) {
      this.regador.arrastando = true
      return true
    }

    // PRIORIDADE 3: Se não pegou no sol nem no regador, carinho no Chouchou
    if (this.chouchou.foiTocado(mouseX, mouseY)) {
      this.chouchou.tocar()
    }
  }

  mouseReleased() {
    if (this.regador.arrastando) {
      this.regador.arrastando = false
      this.regador.x = this.regador.origemX
      this.regador.y = this.regador.origemY
      this._cooldown = 0
    }
  }
}