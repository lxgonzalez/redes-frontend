import { Injectable } from '@angular/core';
import {ArbolExpansion} from "../model/nodo";

@Injectable({
  providedIn: 'root'
})
export class ArbolExpansionService {

  private arbolExpansion: ArbolExpansion = {
    cost: 10.59,
    path: [
      {
        distance: "5.11",
        "end": {
          "address": "Tapi, La Chilena, San Juan, Quito, Centro Historico, Pichincha, 170402, Ecuador",
          "latlng": {
              "lat": -0.223299,
              "lng": -78.515619
            }
        },
        "start": {
          "address": "Pimps, Melchor de Aymerich, Panecillo, Centro Histórico, Quito, Centro Historico, Pichincha, 170602, Ecuador",
          "latlng": {
            "lat": -0.22865234718050612,
            "lng": -78.51765632629396
          }
        }
      },
      {
        "distance": "2.23",
        "end": {
          "address": "Concepción, La Tola Baja, La Tola, Itchimbia, Quito, Centro Historico, Pichincha, 170114, Ecuador",
          "latlng": {
            "lat": -0.221153,
            "lng": -78.512469
          }
        },
        "start": {
          "address": "Tapi, La Chilena, San Juan, Quito, Centro Historico, Pichincha, 170402, Ecuador",
          "latlng": {
            "lat": -0.223299,
            "lng": -78.515619
          }
        }
      },
      {
        "distance": "3.25",
        "end": {
          "address": "Universidad Central del Ecuador, Santa Rosa, Miraflores, Belisario Quevedo, Quito, Mariscal Sucre, Pichincha, 170411, Ecuador",
          "latlng": {
            "lat": -0.202217,
            "lng": -78.504181
          }
        },
        "start": {
          "address": "Tapi, La Chilena, San Juan, Quito, Centro Historico, Pichincha, 170402, Ecuador",
          "latlng": {
            "lat": -0.223299,
            "lng": -78.515619
          }
        }
      }
    ]
  }

  setArbolExpansion(corta: ArbolExpansion): void {
    this.arbolExpansion = corta;
  }

  getArbolExpansion(){
    return this.arbolExpansion;
  }

  constructor() { }
}
