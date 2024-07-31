export class RouteData {
  connections?: Connection[];
  sourceNode?: Node;
  destinationNode?: Node;
}

export class Connection {
  distance: string;
  start?: Node;
  end?: Node;
}

export class Node {
  latlng?: LatLng;
  address?: string;
}

export class LatLng {
  lat?: number;
  lng?: number;
}

export class RutaCorta{
  cost?: number
  path?: Node[]
}

export class ArbolExpansion{
  cost?: number
  path?: Connection[]
}
