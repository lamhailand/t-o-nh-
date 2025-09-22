
export interface Character {
  id: number;
  name: string;
  image: string | null; // base64 string
  selected: boolean;
}

export interface Background {
  image: string | null; // base64 string
  use: boolean;
}

export interface ImageResult {
  id: number;
  src: string;
}
