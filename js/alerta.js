/**
 * Classe alerta per mostrar alertes costumitzades
 */
export default class Alerta {
  /**
     * Inicialitzar les funcionalitats i textos de l'alerta
     * @param {string} titol
     * @param {string} text
     * @param {string} textBotoLeft
     * @param {string} textBotoRight
     * @param {function} funcLeft
     * @param {function} funcRight
     */
  constructor(titol, text, textBotoLeft, textBotoRight, funcLeft, funcRight) {
    this.titol = titol;
    this.text = text;
    this.textBotoLeft = textBotoLeft;
    this.textBotoRight = textBotoRight;
    this.onClickLeft = funcLeft;
    this.onClickRight = funcRight;
  };

  /**
     * Afegir l'html de l'alerta al document
     */
  afegir() {
    /*
        <section class="alerta">
</section>*/
    const html = `<div class="alerta-contingut">
        <p class="alerta-contingut-titol">${this.titol}</p>
        <p class="alerta-contingut-text">${this.text}</p>
        <div class="alerta-butons">
            <button 
            id="alerta-boto-left" 
            style="margin-right: 0.5vw;">${this.textBotoLeft}</button>
            <button 
            id="alerta-boto-right" 
            style="margin-left: 0.5vw;">${this.textBotoRight}</button>
        </div>
        </div>`;

    const section = document.createElement('section');
    section.setAttribute('class', 'alerta');
    document.body.appendChild(section);
    section.innerHTML = html;

    const botoLeft = document.querySelector('#alerta-boto-left');
    const botoRight = document.querySelector('#alerta-boto-right');

    botoLeft.addEventListener('click', (e) => {
      this.onClickLeft(e);
      this.destruir();
    });

    botoRight.addEventListener('click', (e) => {
      this.onClickRight(e);
      this.destruir();
    });
  };

  /**
     * Eliminar l'alerta del html
     */
  destruir() {
    const alerta = document.querySelector('.alerta');
    alerta.parentElement.removeChild(alerta);
  };
};
