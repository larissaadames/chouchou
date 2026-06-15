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

    // O tamanho da "Hitbox" (área de colisão) do Chouchou
    this.jogadorTamanho = 120; 
    this.jogadorX = width / 2;
    this.jogadorY = height - 90;

    this.tempoMastigando = 0; // Timer para a animação de comer
    
    // Garante que o Chouchou entra no jogo com o estado normal
    this.chouchou.setEstado('idle');
  }

  atualizar() {
    let dt = min(deltaTime, 32); 
    let estabilizador = dt / 16.66; 

    // ── 1. Atualizar animação do Chouchou ──
    this.chouchou.update();

    // ── 2. Movimento suave do jogador ──
    let alvoX = constrain(mouseX, this.jogadorTamanho / 2, width - this.jogadorTamanho / 2);
    this.jogadorX += (alvoX - this.jogadorX) * 0.2 * estabilizador;

    // ── 3. Dificuldade e Spawner ──
    this.intervaloSpawn = max(400, 1000 - (this.pontuacao * 3)); 
    let velAtual = this.velocidadeBase + (this.pontuacao / 50);

    this.tempoSpawn += dt;
    if (this.tempoSpawn >= this.intervaloSpawn) {
      this.tempoSpawn = 0;
      this.gerarComida(velAtual);
    }

    // ── 4. Lógica de Colisões e Expressões ──
    let temComidaPerto = false;

    for (let i = this.comidas.length - 1; i >= 0; i--) {
      let item = this.comidas[i];
      item.y += item.velocidade * estabilizador;

      // Verifica se a comida está logo acima do Chouchou para ele abrir a boca
      if (item.y > this.jogadorY - 200 && abs(item.x - this.jogadorX) < 80) {
        temComidaPerto = true;
      }

      // Colisão
      let distancia = dist(this.jogadorX, this.jogadorY, item.x, item.y);
      if (distancia < (this.jogadorTamanho / 2 + item.tamanho / 2)) {
        
        if (item.ehRuim) {
          this.darGameOver();
          this.chouchou.setEstado('triste'); // Fica triste se comer veneno
        } else {
          this.pontuacao += 10;
          this.tempoMastigando = 400; // Fica 400ms mastigando
          
          // Toca um som de mastigação aleatório se eles existirem na memória
          if (typeof SONS_CHOUCHOU !== 'undefined' && SONS_CHOUCHOU.nham) {
            random(SONS_CHOUCHOU.nham).play();
          }
        }
        
        this.comidas.splice(i, 1);
        continue; 
      }

      // Saiu da tela
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

    // ── 5. Máquina de Estados da Expressão ──
    // Se estiver mastigando, mantém o estado 'comendo'. 
    // Se não, verifica se tem comida caindo em cima para 'bocaAberta', senão fica 'idle'
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

    // Opcional: Se quiseres, aqui podes colocar a imagem do elemento 
    // Exemplo: imagem: CATALOGO_COMIDAS.calcio.imagem
    this.comidas.push({
      x: random(50, width - 50),
      y: -50, 
      velocidade: velAtual * random(0.8, 1.2), 
      tamanho: 50,
      ehRuim: ehRuim
    });
  }

  desenhar() {
    background('#fef08a'); 
    noStroke();

    // ── DESENHAR O CHOUCHOU ORIGINAL COM ESCALA ──
    push();
    translate(this.jogadorX, this.jogadorY);
    
    // O sprite base tem 300px. Queremos que ele ocupe cerca de 130px na tela.
    // Então escalamos por 130 / 300 = 0.43
    scale(0.43); 

    // Salvamos a posição original para não bugar a sala depois do minijogo
    let posOriginalX = this.chouchou.x;
    let posOriginalY = this.chouchou.y;

    // Colocamos em 0,0 porque o translate já moveu o "universo" para a posição do jogador
    this.chouchou.x = 0;
    this.chouchou.y = 0;
    
    this.chouchou.draw(); // A MÁGICA ACONTECE AQUI!

    // Restaura a posição original
    this.chouchou.x = posOriginalX;
    this.chouchou.y = posOriginalY;
    pop();

    // ── Desenhar Comidas/Obstáculos ──
    for (let item of this.comidas) {
      if (item.ehRuim) {
        fill('#ef4444');
        rectMode(CENTER);
        rect(item.x, item.y, item.tamanho, item.tamanho, 8); 
        rectMode(CORNER);
      } else {
        fill('#22c55e'); 
        ellipse(item.x, item.y, item.tamanho, item.tamanho); 
      }
      
      // NOTA: Se passares a colocar a propriedade `imagem` no gerarComida(),
      // podes substituir os fills acima por: image(item.imagem, item.x, item.y, item.tamanho, item.tamanho)
    }

    // ── Interface ──
    this.desenharVidas();

    if (frameCount % 30 === 0) this.fpsEstavel = frameRate();
    push();
    textFont('sans-serif'); 
    fill(this.fpsEstavel > 45 ? '#16a34a' : '#dc2626');
    textSize(20);
    textAlign(LEFT, TOP);
    text("FPS: " + this.fpsEstavel.toFixed(0), 40, 80);
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
}