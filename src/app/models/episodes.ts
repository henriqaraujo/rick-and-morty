export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string; // Ex: "S01E01"
  characters: string[]; // URLs dos personagens
  url: string;
  created: string;
}
