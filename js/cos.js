import Card from './card.js';

/**
 * Classe cos on és tiraràn les cartes
 */
export default class Cos {
  /**
     * Inicialitzar una array de dos dimensions per tirar les cartes
     * segons la fila
     */
  constructor() {
    this.cos = [
      [],
      [],
      [],
      [],
    ];
  };

  /**
     * Afegir una carta
     * @param {number} row
     * @param {Card} card
     */
  afegir(row, card) {
    this.cos[row].push(card);
  };

  /**
     * Veure si la fila té el màxim de cartes
     * @param {boolean} row
     * @return {boolean}
     */
  isMax(row) {
    return this.cos[row].length === 3;
  };

  /**
     * Validar la jugada d'una carta
     * @param {number} row
     * @param {Card} card
     * @return {boolean}
     */
  isValid(row, card) {
    if (this.cos[row].length === 0) {
      if (card.suit === 'organ') {
        return !(card.color !== 'comodi' &&
            this.alredyExists(card) !== -1);
      } else return false;
    } else if (this.cos[row].length === 1) {
      if (card.suit === 'virus' || card.suit === 'medicina') {
        return card.color === 'comodi' ||
            this.cos[row][0].color === 'comodi' ||
            this.cos[row][0].color === card.color;
      } else return false;
    } else if (this.cos[row].length === 2) {
      if (card.suit === 'virus' || card.suit === 'medicina') {
        return card.color === 'comodi' || this.cos[row][0].color === 'comodi' ||
            this.cos[row][0].color === card.color;
      } else return false;
    } else return false;
  };

  /**
     * Aconsseguir la jugada valida
     * @param {Card} card
     * @return {number[]}
     */
  checkValidMoves(card) {
    const rows = [];

    if (card.suit === 'organ') {
      for (let i = 0; i < this.cos.length; i++) {
        if (this.cos[i].length === 0) {
          if (card.color === 'comodi' ||
              this.alredyExists(card) === -1) rows.push(i);
          else continue;
        };
      };
    } else if (card.suit === 'virus' || card.suit === 'medicina') {
      for (let i = 0; i < this.cos.length; i++) {
        if (this.cos[i].length > 0 && this.cos[i].length < 3) {
          if (card.color === 'comodi' || this.cos[i][0].color === 'comodi' ||
              this.cos[i][0].color === card.color) rows.push(i);
          else continue;
        };
      };
    };

    return rows;
  };

  /**
     * Aconsseguir i eliminar les cartes que s'han de descartar del cos
     * @param {number} nRow
     * @return {Card[]}
     */
  checkDelete(nRow) {
    const row = this.cos[nRow];

    if (row.length === 3) {
      if (row[1].suit === 'virus' && row[2].suit === 'virus') {
        return row.splice(0, 3);
      } else if ((row[1].suit === 'virus' && row[2].suit === 'medicina') ||
          (row[1].suit === 'medicina' && row[2].suit === 'virus')) {
        return row.splice(1, 3);
      };
    };

    return 0;
  };

  /**
     * Mirar si una carta del mateix color, ja hi és
     * @param {Card} card
     * @return {number}
     */
  alredyExists(card) {
    if (card.suit === 'organ') {
      for (let i = 0; i < this.cos.length; i++) {
        if (this.cos[i].length > 0 &&
            this.cos[i][0].color === card.color) return i;
      };
    };

    return -1;
  };

  /**
     * @return {boolean}
     */
  isWinner() {
    const COLORS = ['verd', 'blau', 'groc', 'vermell', 'comodi'];
    let notFoundCount = 0;

    for (let i = 0; i < COLORS.length; i++) {
      const card = new Card('organ', COLORS[i], '');
      const row = this.alredyExists(card);

      if (row === -1) notFoundCount++;
      else if (this.cos[row].length > 1 &&
          this.cos[row][1].suit === 'virus') notFoundCount++;
    };

    return notFoundCount <= 1;
  };

  /**
     * Buidar el cos
     */
  buidar() {
    this.cos = [
      [],
      [],
      [],
      [],
    ];
  };
};
