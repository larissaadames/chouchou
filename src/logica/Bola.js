// essa classe aqui é a disparervilha que fica na sala de jogos, achei melhor separar num arquivo próprio pra não ficar muito grande

class Bola {
  constructor() {
    this.x = 975;        
    this.y = 70;              
    this.tamanho = 120;         
    this.vx = 0;               
    this.vy = 0;               
    this.gravidade = 0.6;      
    this.atrito = 0.99;        
    this.quique = -0.75;       
    this.arrastando = false;   
    this.mouseAntigoX = 0;     
    this.mouseAntigoY = 0;
    this.iniciada = false;
    this.angulo = 0;
  }

  update() {
    if (this.arrastando) {
      this.vx = mouseX - this.mouseAntigoX;
      this.vy = mouseY - this.mouseAntigoY;
      
      this.mouseAntigoX = mouseX;
      this.mouseAntigoY = mouseY;
      
      this.x = mouseX;
      this.y = mouseY;
    } 
    else if (this.iniciada) {
      this.vy += this.gravidade; 
      this.vx *= this.atrito;    

      this.x += this.vx;
      this.y += this.vy;

      let raio = this.tamanho / 2;
      this.angulo += this.vx / raio; 

      let chao = height - 72; 

      if (this.y > chao - raio) {
        this.y = chao - raio;
        this.vy *= this.quique; 
        this.vx *= 0.95;     
      }
      if (this.y < 66 + raio) { 
        this.y = 66 + raio;
        this.vy *= this.quique;
      }
      if (this.x > width - raio) {
        this.x = width - raio;
        this.vx *= this.quique;
      } 
      else if (this.x < raio) {
        this.x = raio;
        this.vx *= this.quique;
      }
    }
  }

  draw() {
    push(); 
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.angulo); 

    if (SPRITES_OBJETOS.disparervilha) {
      image(SPRITES_OBJETOS.disparervilha, 0, 0, this.tamanho, this.tamanho);
    } else {
      fill('#ff66b2');
      ellipse(0, 0, this.tamanho, this.tamanho);
      fill(0); 
      ellipse(15, 0, 10, 10);
    }
    pop();
  }

  mousePressed() {
    let distanciaBola = dist(mouseX, mouseY, this.x, this.y);
    if (distanciaBola < this.tamanho / 2) {
      this.arrastando = true;
      this.iniciada = true; 
      this.mouseAntigoX = mouseX;
      this.mouseAntigoY = mouseY;
      return true; // Retorna verdadeiro (Avisando que o mouse pegou a bola)
    }
    return false; // Retorna falso se não clicou na bola
  }

  mouseReleased() {
    if (this.arrastando) {
      this.arrastando = false;
    }
  }
}