/**
 * Classe per crear una carta
 */
export default class Card {
  /**
     * Inicialitzar les propietats necessaries per una carta
     * @param {string} suit - La suit en la que pertany la carta
     * @param {string} color - El valor de la carta
     * @param {string} img - El link de la imatge de la carta
     * @return {void}
     */
  constructor(suit, color, img) {
    this.suit = suit;
    this.color = color;
    this.img = img;
  };


  /**
     * Agafar el nom de la carta segons el tipus i el color,
     * en cas d'organ; cor, estomac,...
     * @return {string}
     */
  agafarNom() {
    switch (this.suit) {
      case 'orgam':
        switch (this.color) {
          case 'vermell':
            return 'cor';
          case 'groc':
            return 'ossos';
          case 'blau':
            return 'cerbell';
          case 'verd':
            return 'estomac';
          case 'comodi':
            return 'comodi';
        };
        break;
      case 'virus':
        switch (this.color) {
          case 'vermell':
            return 'covid';
          case 'groc':
            return 'càncer';
          case 'blau':
            return 'diabetis';
          case 'verd':
            return 'gastritis';
          case 'comodi':
            return 'comodi';
        };
        break;
      case 'medicina':
        switch (this.color) {
          case 'vermell':
            return 'paracetamol';
          case 'groc':
            return 'ibuprofeno';
          case 'blau':
            return 'amoxicilina';
          case 'verd':
            return 'omeprazol';
          case 'comodi':
            return 'comodi';
        };
        break;
    };

    return undefined;
  };
};
