class JogoQueda extends MinijogoBase {
  constructor(manager, chouchou) {
    super(manager, chouchou); 
    this.fpsEstavel = 60;
  }

  iniciar() {
    this.nuvens = [];            
    
    this.tempoSpawn = 0;          
    this.intervaloSpawn = 1200;    
    this.velocidadeBase = 6;      

    this.jogadorTamanho = 130; 
    this.jogadorX = width / 2;
    this.jogadorY = 160; 

    // Variáveis para o movimento "patinado"
    this.velocidadeX = 0;
    this.aceleracao = 0.2; 
    this.atrito = 0.15; 

    this.chouchou.setEstado('feliz');
  }

  atualizar() {
    let dt = min(deltaTime, 32); 
    let estabilizador = dt / 16.66; 

    this.chouchou.update();

    // ── 1. Movimento "Patinado" (Inércia) ──
    let direcao = mouseX - this.jogadorX;
    this.velocidadeX += (direcao * 0.05) * estabilizador; 
    this.velocidadeX *= this.atrito; 
    this.jogadorX += this.velocidadeX * estabilizador;

    this.jogadorX = constrain(this.jogadorX, this.jogadorTamanho / 2, width - this.jogadorTamanho / 2);

    // ── 2. Dificuldade e Spawner ──
    this.intervaloSpawn = max(400, 1200 - (this.pontuacao * 1.5)); 
    let velAtual = this.velocidadeBase + (this.pontuacao / 30);

    this.tempoSpawn += dt;
    if (this.tempoSpawn >= this.intervaloSpawn) {
      this.tempoSpawn = 0;
      this.gerarNuvem(velAtual);
    }

    // ── 3. Lógica de Colisões (Hitbox Reduzida para o Topo) ──
    for (let i = this.nuvens.length - 1; i >= 0; i--) {
      let nuvem = this.nuvens[i];
      nuvem.y -= nuvem.velocidade * estabilizador;

      // Cálculo da Hitbox: 
      // Topo: [nuvem.y - altura/2] até [nuvem.y] (apenas metade superior da nuvem)
      // Largura: toda a largura da nuvem
      let hitboxTop = nuvem.y - nuvem.altura / 2;
      let hitboxBottom = nuvem.y; // Corta a nuvem na metade
      let hitboxLeft = nuvem.x - nuvem.largura / 2;
      let hitboxRight = nuvem.x + nuvem.largura / 2;

      // Verificação se o centro do Chouchou está dentro desse retângulo reduzido
      if (this.jogadorX > hitboxLeft && 
          this.jogadorX < hitboxRight && 
          this.jogadorY > hitboxTop && 
          this.jogadorY < hitboxBottom) {
        
        this.darGameOver();
        this.chouchou.setEstado('triste'); 
        continue; 
      }

      if (nuvem.y < -nuvem.altura) {
        this.pontuacao += 10; 
        this.nuvens.splice(i, 1);
      }
    }
  }

  gerarNuvem(velAtual) {
    let larguraSorteada = random(350, 560); 
    let alturaSorteada = random(150,200);
    // larguraSorteada > 500 ? alturaSorteada = random(120, 180) : alturaSorteada;

    this.nuvens.push({
      x: random(larguraSorteada / 2, width - larguraSorteada / 2),
      y: height + alturaSorteada,
      velocidade: velAtual * random(0.7, 1), 
      largura: larguraSorteada,
      altura: alturaSorteada
    });
  }

  desenhar() {
    background('#38bdf8'); 
    noStroke();

    // ── Desenhar Nuvens Largas ──
    for (let nuvem of this.nuvens) {
      fill(255, 255, 255, 230);
      ellipse(nuvem.x, nuvem.y, nuvem.largura, nuvem.altura); 
      ellipse(nuvem.x - nuvem.largura * 0.3, nuvem.y + 10, nuvem.largura * 0.4, nuvem.altura * 0.8);
      ellipse(nuvem.x + nuvem.largura * 0.3, nuvem.y + 10, nuvem.largura * 0.4, nuvem.altura * 0.8);
    }

    // ── DESENHAR O CHOUCHOU ──
    push();
    translate(this.jogadorX, this.jogadorY);
    scale(0.55); 

    let posOriginalX = this.chouchou.x;
    let posOriginalY = this.chouchou.y;

    this.chouchou.x = 0;
    this.chouchou.y = 0;
    
    this.chouchou.draw(); 

    this.chouchou.x = posOriginalX;
    this.chouchou.y = posOriginalY;
    pop();

    // ── Efeitos de Vento ──
    fill(255, 255, 255, 80);
    for (let i = 0; i < 3; i++) {
      let linhaY = (frameCount * 15 + i * 200) % height;
      rect(random(width), linhaY, 3, random(20, 60), 5);
    }

    // ── Monitor de FPS ──
    if (frameCount % 30 === 0) this.fpsEstavel = frameRate();
    push();
    textFont('sans-serif'); 
    fill(this.fpsEstavel > 45 ? '#16a34a' : '#dc2626');
    textSize(20);
    textAlign(LEFT, TOP);
    text("FPS: " + this.fpsEstavel.toFixed(0), 40, 80);
    pop();
  }

  sairDoJogo() {
    this.chouchou.setEstado('idle'); 
    super.sairDoJogo();
  }
}