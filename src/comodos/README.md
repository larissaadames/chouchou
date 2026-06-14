
---

## Para adicionar um novo cômodo no futuro

Só duas etapas:

**1.** Cria o arquivo `src/comodos/Sala.js` seguindo o mesmo padrão:
```js
class Sala {
  constructor() { this.nome = 'Sala' }
  update() {}
  draw() { /* seu cenário */ }
  mousePressed() {}
}
```

**2.** Adiciona no `index.html` e no array do `ComodoScene`:
```js
this.comodos = [
  new Quarto(),
  new Cozinha(),
  new Banheiro(),
  new Sala(), // ← só isso
]
```