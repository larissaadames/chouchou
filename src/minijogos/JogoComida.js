class JogoComida extends MinijogoBase {
  constructor(manager, chouchou) {
    super(manager, chouchou); 
    this.fpsEstavel = 60;
  }

  iniciar() {
    this.comidas = [];            
    this.vidas = 5;               
    
    this.tempoSpawn = 0;          
    this.intervaloSpawn = 1000;   
    this.velocidadeBase = 5;      

    // ── 1. Aumentamos o tamanho e a Hitbox do Chouchou ──
    this.jogadorTamanho = 180; // (Antes era 120)
    this.jogadorX = width / 2;
    this.jogadorY = height - 100; // Subiu um pouco para compensar o tamanho novo

    this.tempoMastigando = 0; 
    
    // ── 2. Lista de Imagens de Elementos para as Comidas ──
    this.imagensElementos = [
      CATALOGO_COMIDAS.nitrogenio.imagem,
      CATALOGO_COMIDAS.fosforo.imagem,
      CATALOGO_COMIDAS.potassio.imagem,
      CATALOGO_COMIDAS.calcio.imagem,
      CATALOGO_COMIDAS.magnesio.imagem,
      CATALOGO_COMIDAS.enxofre.imagem
    ];
    
    // Toca a música de fundo em Looping
    if (SONS_CHOUCHOU.musica_fooddrop && !SONS_CHOUCHOU.musica_fooddrop.isPlaying()) {
      SONS_CHOUCHOU.musica_fooddrop.loop();
    }

    this.chouchou.setEstado('idle');
  }

  atualizar() {
    let dt = min(deltaTime, 32); 
    let estabilizador = dt / 16.66; 

    this.chouchou.update();

    let alvoX = constrain(mouseX, this.jogadorTamanho / 2, width - this.jogadorTamanho / 2);
    this.jogadorX += (alvoX - this.jogadorX) * 0.2 * estabilizador;

    this.intervaloSpawn = max(400, 1000 - (this.pontuacao * 3)); 
    let velAtual = this.velocidadeBase + (this.pontuacao / 50);

    this.tempoSpawn += dt;
    if (this.tempoSpawn >= this.intervaloSpawn) {
      this.tempoSpawn = 0;
      this.gerarComida(velAtual);
    }

    let temComidaPerto = false;

    for (let i = this.comidas.length - 1; i >= 0; i--) {
      let item = this.comidas[i];
      
      // Aplica a queda e a ROTAÇÃO baseada no estabilizador
      item.y += item.velocidade * estabilizador;
      item.angulo += item.velAngulo * estabilizador; 

      if (item.y > this.jogadorY - 250 && abs(item.x - this.jogadorX) < 100) {
        temComidaPerto = true;
      }

      // Colisão Ajustada
      let distancia = dist(this.jogadorX, this.jogadorY, item.x, item.y);
      if (distancia < (this.jogadorTamanho / 2 + item.tamanho / 2 - 20)) { // -20 pra ficar mais justo
        
        if (item.ehRuim) {
          this.darGameOver();
          this.chouchou.setEstado('triste'); 
        } else {
          this.pontuacao += 10;
          this.tempoMastigando = 400; 
          
          if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.nham) {
            random(SONS_CHOUCHOU.nham).play();
          }
        }
        
        this.comidas.splice(i, 1);
        continue; 
      }

      if (item.y > height + item.tamanho) {
        if (!item.ehRuim) {
          this.vidas--;
          if (this.vidas <= 0) {
            this.darGameOver();
            this.chouchou.setEstado('triste');
          }
        }
        this.comidas.splice(i, 1);
      }
    }

    if (this.tempoMastigando > 0) {
      this.tempoMastigando -= dt;
      this.chouchou.setEstado('comendo');
    } else if (temComidaPerto && this.estado !== 'GAMEOVER') {
      this.chouchou.setEstado('bocaAberta');
    } else if (this.estado !== 'GAMEOVER') {
      this.chouchou.setEstado('idle');
    }
  }

  gerarComida(velAtual) {
    let ehRuim = random(1) < 0.25; 
    let imgEscolhida = random(this.imagensElementos);

    this.comidas.push({
      x: random(50, width - 50),
      y: -50, 
      velocidade: velAtual * random(0.8, 1.2), 
      tamanho: 100, // Aumentei o tamanho das comidas
      ehRuim: ehRuim,
      imagem: imgEscolhida,
      angulo: random(TWO_PI),              // Nasce num ângulo aleatório
      velAngulo: random(-0.08, 0.08)       // Velocidade de giro (negativa=esquerda, positiva=direita)
    });
  }

  desenhar() {

    if (typeof SPRITES_CENARIO !== 'undefined' && SPRITES_CENARIO.food_drop) {
      imageMode(CORNER);
      image(SPRITES_CENARIO.food_drop, 0, 0, width, height);
    } else {
      
      background('#fef08a'); 

    }
    noStroke();

    // ── DESENHAR O CHOUCHOU ──
    push();
    translate(this.jogadorX, this.jogadorY);
    scale(0.65); // <-- ESCALA AUMENTADA! (Era 0.43)

    let posOriginalX = this.chouchou.x;
    let posOriginalY = this.chouchou.y;

    this.chouchou.x = 0;
    this.chouchou.y = 0;
    
    this.chouchou.draw(); 

    this.chouchou.x = posOriginalX;
    this.chouchou.y = posOriginalY;
    pop();

    // ── DESENHAR COMIDAS COM ROTAÇÃO ──
    for (let item of this.comidas) {
      push();
      // Move o ponto central para onde a comida está e depois aplica a rotação
      translate(item.x, item.y);
      rotate(item.angulo);
      imageMode(CENTER);
      
      // Se for obstáculo (veneno), aplica uma máscara vermelha intensa sobre a imagem!
      if (item.ehRuim) {
        tint(0); 
      }
      
      if (item.imagem) {
        image(item.imagem, 0, 0, item.tamanho, item.tamanho);
      } else {
        // Fallback caso a imagem não carregue
        fill(item.ehRuim ? '#ef4444' : '#22c55e');
        ellipse(0, 0, item.tamanho, item.tamanho); 
      }
      
      noTint(); // Limpa o filtro de cor para não afetar outras coisas
      pop(); // Restaura o canvas ao normal
    }

    this.desenharVidas();

    // if (frameCount % 30 === 0) this.fpsEstavel = frameRate();
    // push();
    // textFont('sans-serif'); 
    // fill(this.fpsEstavel > 45 ? '#16a34a' : '#dc2626');
    // textSize(20);
    // textAlign(LEFT, TOP);
    // text("FPS: " + this.fpsEstavel.toFixed(0), 40, 80);
    pop();
  }

  desenharVidas() {
    fill('#ef4444');
    noStroke();
    let espaco = 30;
    let inicioX = (width / 2) - ((this.vidas - 1) * espaco / 2);
    for (let i = 0; i < this.vidas; i++) {
      ellipse(inicioX + (i * espaco), 40, 20, 20);
    }
  }

  // ── SOBRESCRITA DOS EVENTOS DA CLASSE BASE ──

  darGameOver() {
    // Parar a música e tocar som de game over
    if (SONS_CHOUCHOU.musica_fooddrop && SONS_CHOUCHOU.musica_fooddrop.isPlaying()) {
      SONS_CHOUCHOU.musica_fooddrop.stop();
    }
    if (SONS_CHOUCHOU.game_over) {
      SONS_CHOUCHOU.game_over.play();
    }
    // Chama o comportamento original (mostrar ecrã, dar pontos)
    super.darGameOver();
  }

  sairDoJogo() {
    // Parar a música se o jogador abandonar o jogo pelo menu de pausa
    if (SONS_CHOUCHOU.musica_fooddrop && SONS_CHOUCHOU.musica_fooddrop.isPlaying()) {
      SONS_CHOUCHOU.musica_fooddrop.stop();
    }
    
    // Força o Chouchou a voltar ao normal antes de fechar a cena
    this.chouchou.setEstado('idle'); 
    
    super.sairDoJogo();
  }
}