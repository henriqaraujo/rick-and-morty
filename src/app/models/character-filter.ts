export interface CharacterFilter {
  page?: number;
  name?: string;
  status?: 'alive'|'dead'|'unknown';
  species?: string;
  type?: string;
  gender?: 'female'|'male'|'genderless'|'unknown'
}
