import { CharacterGender } from "./enuns/character-gender.enum";
import { CharacterStatus } from "./enuns/character-status.enum";

export interface Character {
  /**
   * ID do personagem
   */
  id: number;

  /**
   * Nome do personagem
   */
  name: string;

  /**
   * Status do personagem
   */
  status?: CharacterStatus;

    /**
   *
   */
  species: string;

  /**
   * Tipo de personagem
   */
  type: string;

  /**
   * Gênero do personagem
   */
  gender: CharacterGender;

  /**
   * Origem do personagem
   */
  origin: {
    /**
     * Nome da origem
     */
    name: string;

    /**
     * Url da origem
     */
    url: string;
  };

  /**
   * Lozalização do personagem
   */
  location: {
    /**
     * Nome da localização
     */
    name: string;

    /**
     * Url da localização
     */
    url: string;
  };

  /**
   * Imagem do personagem
   */
  image: string;

  /**
   * Lista de episódios
   */
  episode: string[];

  /**
   * Link
   */
  url: string;

  /**
   * Data de cadastro do personagem
   */
  created: string;
}
