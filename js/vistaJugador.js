/**
 * Classe que obté els elements necessaris de cada jugador de la vista
 */
export default class VistaJugador {
  /**
     * Obtindrà i guardarà els elements segons el número del jugador
     * @param {number} nJugador
     */
  constructor(nJugador) {
    this.num = nJugador;
    this.jugador = document.querySelector('#jugador' + nJugador);
    this.cartes = this.jugador.querySelector('.cartes');
    this.descart = this.jugador.querySelector('.descart');
    this.torn = this.jugador.querySelector('.next-button');
    this.cos = document.querySelectorAll('#cos-jugador-' + nJugador + ' div');
  };
};
