// O ficheiro JogoPulo.js
class JogoPulo extends MinijogoBase {
  constructor(manager, chouchou) {
    super(manager, chouchou); 
    this.fpsEstavel = 60; // Guarda o FPS médio
  }

  iniciar() {
    this.jogadorY = height - 100;
    this.velocidadeY = 0;
    this.gravidade = 0.8;
    this.obstaculoX = width;
  }

  atualizar() {
    let dt = min(deltaTime, 32); 
    let estabilizador = dt / 16.66; 

    this.velocidadeY += this.gravidade * estabilizador;
    this.jogadorY += this.velocidadeY * estabilizador;

    if (this.jogadorY > height - 100) {
      this.jogadorY = height - 100;
      this.velocidadeY = 0;
    }

    this.obstaculoX -= 6 * estabilizador; 
    
    if (this.obstaculoX < -40) { 
      this.obstaculoX = width;
      this.pontuacao += 10; 
    }

    let distancia = dist(100, this.jogadorY, this.obstaculoX, height - 100);
    if (distancia < 40) {
      this.darGameOver(); 
    }
  }

  desenhar() {
    background('#87CEEB'); 

    noStroke(); // <--- DESLIGA OS CONTORNOS (Alivia drasticamente a renderização)

    // Chão
    fill('#22c55e');
    rect(0, height - 80, width, 80);

    // Obstáculo
    fill('#ef4444');
    rect(this.obstaculoX, height - 120, 40, 40);

    // Jogador 
    fill(this.chouchou.cor.r, this.chouchou.cor.g, this.chouchou.cor.b);
    ellipse(100, this.jogadorY, 50, 50);

    // ─── MONITOR DE FPS OTIMIZADO ───
    if (frameCount % 30 === 0) {
      this.fpsEstavel = frameRate();
    }

    push();
    textFont('sans-serif'); // Força o FPS a usar fonte padrão para não travar
    if (this.fpsEstavel > 45) {
      fill(0, 255, 0); // Verde
    } else {
      fill(255, 0, 0); // Vermelho
    }
    textSize(24);
    textAlign(LEFT, TOP);
    text("FPS: " + this.fpsEstavel.toFixed(0), 40, 80);
    pop();
  }

  clicar() {
    if (this.jogadorY >= height - 100) {
      this.velocidadeY = -15; 
    }
  }
}