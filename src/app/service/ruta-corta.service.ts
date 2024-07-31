import { Injectable } from '@angular/core';
import {RutaCorta} from "../model/nodo";

@Injectable({
  providedIn: 'root'
})
export class RutaCortaService {

  private rutaCorta: RutaCorta

  setRutaCorta(corta: RutaCorta): void {
    this.rutaCorta = corta;
  }

  getRutaCorta(){
    return this.rutaCorta;
  }

  constructor() { }
}
