import { Injectable } from '@angular/core';
import {ArbolExpansion} from "../model/nodo";

@Injectable({
  providedIn: 'root'
})
export class ArbolExpansionService {

  private arbolExpansion: ArbolExpansion

  setArbolExpansion(corta: ArbolExpansion): void {
    this.arbolExpansion = corta;
  }

  getArbolExpansion(){
    return this.arbolExpansion;
  }

  constructor() { }
}
