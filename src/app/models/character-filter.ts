import { CharacterGender } from "./enuns/character-gender.enum";
import { CharacterStatus } from "./enuns/character-status.enum";

export interface CharacterFilter {
  /**
   * Número da página
   */
  page?: number;

  /**
   * Nome do personagem
   */
  name?: string;

  /**
   * Status do personagem
   */
  status?: CharacterStatus;

  /**
   *
   */
  species?: string;

  /**
   * Tipo do personagem
   */
  type?: string;

  /**
   * Gênero do personagem
   */
  gender?: CharacterGender
}
