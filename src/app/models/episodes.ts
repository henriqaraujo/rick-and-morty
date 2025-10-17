export interface Episode {

  /**
   * Id do episódio
   */
  id: number;

  /**
   * Nome do Episódio
   */
  name: string;

/**
 * Data que episódio foi ao ar
 */
  air_date: string;

  /**
   * Código do episódio
   */
  episode: string;

  /**
   * Lista de personagens
   */
  characters: string[];

  /**
   * Link do episódio
   */
  url: string;

  /**
   * Data de criação
   */
  created: string;
}
