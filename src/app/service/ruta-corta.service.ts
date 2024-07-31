import { Injectable } from '@angular/core';
import {RutaCorta} from "../model/nodo";

@Injectable({
  providedIn: 'root'
})
export class RutaCortaService {

  private rutaCorta: RutaCorta = {
    cost: 4.81,
    path: [
      {
        address: "Sucre, Centro Histórico, Quito, Centro Historico, Pichincha, 170114, Ecuador",
        latlng: { lat: -0.2271932370213656, lng: -78.50769073565623 }
      },
      {
        address: "Avenida América, America, San Juan, Quito, Mariscal Sucre, Pichincha, 170118, Ecuador",
        latlng: { lat: -0.21637865131182774, lng: -78.50879061736212 }
      },
      {
        address: "Iquique, Guangacalle, Itchimbia, Quito, Mariscal Sucre, Pichincha, 170413, Ecuador",
        latlng: { lat: -0.2106628923746785, lng: -78.51879061736212 }
      }
    ]
  };

  setRutaCorta(corta: RutaCorta): void {
    this.rutaCorta = corta;
  }

  getRutaCorta(){
    return this.rutaCorta;
  }

  constructor() { }
}
