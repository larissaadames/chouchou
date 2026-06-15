// ─── Sala de Jogos ────────────────────────────────────────────────────────────
class SalaJogos {
  constructor(chouchou) {
    this.nome      = 'Sala de Jogos'
    this.chouchou  = chouchou

    this.bola = {
      x: 975,        
      y: 70,              
      tamanho: 120,         
      vx: 0,               
      vy: 0,               
      gravidade: 0.6,      
      atrito: 0.99,        
      quique: -0.75,       
      arrastando: false,   
      mouseAntigoX: 0,     
      mouseAntigoY: 0,
      iniciada: false,
      angulo: 0
    }
  }

  update() {
    let b = this.bola;

    if (b.arrastando) {
      b.vx = mouseX - b.mouseAntigoX;
      b.vy = mouseY - b.mouseAntigoY;
      
      b.mouseAntigoX = mouseX;
      b.mouseAntigoY = mouseY;
      
      b.x = mouseX;
      b.y = mouseY;
    } 
    // NOVO: A física só roda se "iniciada" for true!
    else if (b.iniciada) {
      // ── FÍSICA APLICADA ──
      b.vy += b.gravidade; 
      b.vx *= b.atrito;    

      b.x += b.vx;
      b.y += b.vy;

      // ── ROTAÇÃO ──
      // A variação do ângulo é a velocidade horizontal dividida pelo raio (física de rolamento)
      let raio = b.tamanho / 2;
      b.angulo += b.vx / raio; 

      // ── COLISÕES COM AS BORDAS ──
      let chao = height - 72; 

      if (b.y > chao - raio) {
        b.y = chao - raio;
        b.vy *= b.quique; 
        b.vx *= 0.95;     
      }

      if (b.y < 66 + raio) { 
        b.y = 66 + raio;
        b.vy *= b.quique;
      }

      if (b.x > width - raio) {
        b.x = width - raio;
        b.vx *= b.quique;
      } 
      else if (b.x < raio) {
        b.x = raio;
        b.vx *= b.quique;
      }
    }
  }

  draw() {
    // ── Fundo ───────────────────────────────────────────────────────────────
    push(); 
    imageMode(CORNER);
    if (SPRITES_CENARIO.salajogos) {
      image(SPRITES_CENARIO.salajogos, 0, 0, width, height);
    } else {
      background('#a88d52'); 
    }
    pop(); 

    // ── Chouchou ──────────────────────────────────────────────────────────────
    this.chouchou.draw()

    // --- Bola ───────────────────────────────────────────────────────────────
    push(); 
    imageMode(CENTER);
    
    // NOVO: Para rotacionar a imagem, precisamos mover o "eixo" para o centro da bola
    translate(this.bola.x, this.bola.y);
    rotate(this.bola.angulo); // Gira o eixo baseado na velocidade

    if (SPRITES_OBJETOS.disparervilha) {
      // Como transladamos o eixo para a bola, desenhamos a imagem na posição (0, 0)
      image(SPRITES_OBJETOS.disparervilha, 0, 0, this.bola.tamanho, this.bola.tamanho);
    } else {
      fill('#ff66b2');
      ellipse(0, 0, this.bola.tamanho, this.bola.tamanho);
      
      // Detalhe extra: fiz um "olhinho" preto no placeholder só pra você
      // conseguir ver ela girando caso a imagem PNG falhe em carregar!
      fill(0);
      ellipse(15, 0, 10, 10);
    }
    pop(); // pop() restaura o eixo ao normal para não afetar mais nada
  }

  mousePressed() {
    let distanciaBola = dist(mouseX, mouseY, this.bola.x, this.bola.y);
    
    if (distanciaBola < this.bola.tamanho / 2) {
      this.bola.arrastando = true;
      this.bola.iniciada = true; // NOVO: Libera a física para sempre agora!
      this.bola.mouseAntigoX = mouseX;
      this.bola.mouseAntigoY = mouseY;
      return; 
    }

    if (this.chouchou.foiTocado(mouseX, mouseY)) {
      this.chouchou.tocar()
    }
  }

  mouseReleased() {
    if (this.bola.arrastando) {
      this.bola.arrastando = false;
    }
  }
}