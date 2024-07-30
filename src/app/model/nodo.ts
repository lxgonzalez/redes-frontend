export class Nodo{
  constructor(lng: number, lat: number) {
    this.longitud = lng;
    this.latitud = lat;
  }

  latitud: number
  longitud: number
  nombre: string
  distancia?: 0
}

export class Graph {
  [key: string]: { [key: string]: number };
}

export class ShortestPathRequest {
  graph: Graph;
  start: string;
  end: string;
}
