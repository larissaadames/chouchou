// O ficheiro JogoPulo.js
class JogoPulo extends MinijogoBase {
  constructor(manager, chouchou) {
    // O super() avisa a classe base para se preparar
    super(manager, chouchou); 
  }

  // É chamado sempre que o jogo recomeça
  iniciar() {
    this.jogadorY = height - 100;
    this.velocidadeY = 0;
    this.gravidade = 0.8;
    this.obstaculoX = width;
  }

  // A física e lógica (substitui o update do jogo)
  atualizar() {
    // Física do salto
    this.velocidadeY += this.gravidade;
    this.jogadorY += this.velocidadeY;

    // Bater no chão
    if (this.jogadorY > height - 100) {
      this.jogadorY = height - 100;
      this.velocidadeY = 0;
    }

    // Mover obstáculo
    this.obstaculoX -= 5;
    
    // Ganha pontos ao passar o obstáculo
    if (this.obstaculoX < 0) {
      this.obstaculoX = width;
      this.pontuacao += 10; // A variável pontuacao já existe na Classe Base!
    }

    // Colisão simples = Game Over
    let distancia = dist(100, this.jogadorY, this.obstaculoX, height - 100);
    if (distancia < 40) {
      this.darGameOver(); // Basta chamar isto para perder e parar tudo!
    }
  }

  // Desenhar os elementos no ecrã
  desenhar() {
    background('#87CEEB'); // Céu azul

    // Chão
    fill('#22c55e');
    rect(0, height - 80, width, 80);

    // Obstáculo
    fill('#ef4444');
    rect(this.obstaculoX, height - 120, 40, 40);

    // Jogador (Podes usar o SPRITE do Chouchou aqui depois!)
    fill(this.chouchou.cor.r, this.chouchou.cor.g, this.chouchou.cor.b);
    ellipse(100, this.jogadorY, 50, 50);
  }

  // Interação exclusiva do minijogo
  clicar() {
    // Se o jogador estiver no chão, salta
    if (this.jogadorY >= height - 100) {
      this.velocidadeY = -15; 
    }
  }
}