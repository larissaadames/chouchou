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

    this.velocidadeX = 0;
    this.aceleracao = 0.25; 
    this.atrito = 0.15; 

    // Toca a música de queda livre
    if (SONS_CHOUCHOU.free_fall && !SONS_CHOUCHOU.free_fall.isPlaying()) {
      SONS_CHOUCHOU.free_fall.loop();
    }

    this.chouchou.setEstado('feliz');
  }

  // ── CONTROLE DA MÚSICA NA PAUSA ──
  aoPausar() {
    if (SONS_CHOUCHOU.free_fall && SONS_CHOUCHOU.free_fall.isPlaying()) {
      SONS_CHOUCHOU.free_fall.pause();
    }
  }

  aoRetomar() {
    if (SONS_CHOUCHOU.free_fall && !SONS_CHOUCHOU.free_fall.isPlaying()) {
      SONS_CHOUCHOU.free_fall.loop();
    }
  }

  atualizar() {
    let dt = min(deltaTime, 32); 
    let estabilizador = dt / 16.66; 

    this.chouchou.update();

    let direcao = mouseX - this.jogadorX;
    this.velocidadeX += (direcao * 0.05) * estabilizador; 
    this.velocidadeX *= this.atrito; 
    this.jogadorX += this.velocidadeX * estabilizador;

    this.jogadorX = constrain(this.jogadorX, this.jogadorTamanho / 2, width - this.jogadorTamanho / 2);

    this.intervaloSpawn = max(400, 1200 - (this.pontuacao * 1.5)); 
    let velAtual = this.velocidadeBase + (this.pontuacao / 30);

    this.tempoSpawn += dt;
    if (this.tempoSpawn >= this.intervaloSpawn) {
      this.tempoSpawn = 0;
      this.gerarNuvem(velAtual);
    }

    for (let i = this.nuvens.length - 1; i >= 0; i--) {
      let nuvem = this.nuvens[i];
      nuvem.y -= nuvem.velocidade * estabilizador;

      let hitboxTop = nuvem.y - nuvem.altura / 2;
      let hitboxBottom = nuvem.y; 
      let hitboxLeft = nuvem.x - nuvem.largura / 2;
      let hitboxRight = nuvem.x + nuvem.largura / 2;

      if (this.jogadorX > hitboxLeft && 
          this.jogadorX < hitboxRight && 
          this.jogadorY > hitboxTop && 
          this.jogadorY < hitboxBottom) {
        
        this.darGameOver();
        this.chouchou.setEstado('triste'); 
        continue; 
      }

      if (nuvem.y < -nuvem.altura) {
        this.pontuacao += 15; 
        this.nuvens.splice(i, 1);
      }
    }
  }

  gerarNuvem(velAtual) {
    let larguraSorteada = random(300, 500); 
    let alturaSorteada = larguraSorteada * 0.5;

    let nuvensDisponiveis = [];
    if (typeof SPRITES_OBJETOS !== 'undefined') {
      if (SPRITES_OBJETOS.nuvem1) nuvensDisponiveis.push(SPRITES_OBJETOS.nuvem1);
      if (SPRITES_OBJETOS.nuvem2) nuvensDisponiveis.push(SPRITES_OBJETOS.nuvem2);
      if (SPRITES_OBJETOS.nuvem3) nuvensDisponiveis.push(SPRITES_OBJETOS.nuvem3);
      if (SPRITES_OBJETOS.nuvem4) nuvensDisponiveis.push(SPRITES_OBJETOS.nuvem4);
    }

    let spriteSorteado = null;
    if (nuvensDisponiveis.length > 0) {
      spriteSorteado = random(nuvensDisponiveis);
    }

    this.nuvens.push({
      x: random(larguraSorteada / 2, width - larguraSorteada / 2),
      y: height + alturaSorteada,
      velocidade: velAtual * random(0.8, 1.2), 
      largura: larguraSorteada,
      altura: alturaSorteada,
      sprite: spriteSorteado
    });
  }
  
  desenhar() {
    background('#38bdf8'); 
    noStroke();

    for (let nuvem of this.nuvens) {
      if (nuvem.sprite) {
        push();
        imageMode(CENTER);
        image(nuvem.sprite, nuvem.x, nuvem.y, nuvem.largura, nuvem.altura);
        pop();
      } else {
        fill(255, 255, 255, 230);
        ellipse(nuvem.x, nuvem.y, nuvem.largura, nuvem.altura); 
        ellipse(nuvem.x - nuvem.largura * 0.3, nuvem.y + 10, nuvem.largura * 0.4, nuvem.altura * 0.8);
        ellipse(nuvem.x + nuvem.largura * 0.3, nuvem.y + 10, nuvem.largura * 0.4, nuvem.altura * 0.8);
      }
    }

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

    fill(255, 255, 255, 80);
    for (let i = 0; i < 3; i++) {
      let linhaY = (frameCount * 15 + i * 200) % height;
      rect(random(width), linhaY, 3, random(20, 60), 5);
    }
  }

  darGameOver() {
    if (SONS_CHOUCHOU.free_fall && SONS_CHOUCHOU.free_fall.isPlaying()) {
      SONS_CHOUCHOU.free_fall.stop();
    }
    if (SONS_CHOUCHOU.game_over) {
      SONS_CHOUCHOU.game_over.play();
    }
    super.darGameOver();
  }

  sairDoJogo() {
    if (SONS_CHOUCHOU.free_fall && SONS_CHOUCHOU.free_fall.isPlaying()) {
      SONS_CHOUCHOU.free_fall.stop();
    }
    this.chouchou.setEstado('idle'); 
    super.sairDoJogo();
  }
}