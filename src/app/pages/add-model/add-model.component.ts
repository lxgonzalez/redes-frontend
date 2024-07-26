import {AfterViewInit, Component, input, signal} from '@angular/core';
import {LeafletMouseEvent, map, tileLayer} from "leaflet";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {Nodo} from "../../model/nodo";
import {MatToolbar} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-add-model',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatTableModule, MatToolbar, RouterLink],
  templateUrl: './add-model.component.html',
  styleUrl: './add-model.component.css'
})
export class AddModelComponent implements AfterViewInit{
  start = signal<Nodo>({ longitud: 0, latitud: 0 })
  end = signal<Nodo>({ longitud: 0, latitud: 0 })
  statusStart = signal<boolean>(true)
  statusEnd = signal<boolean>(true)

  private map;
  private nodo: Nodo[] = []

  displayedColumns: string[] = ['parada1', 'parada2', 'distancia'];
  dataSource = this.nodo;

  ngAfterViewInit(): void {
    this.initMap()
  }

  private initMap(): void {
    this.map = map('map', {
      center: [-0.22,-78.50],
      zoom: 14
    });

    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
    });
    tiles.addTo(this.map);
    this.addNodo()
  }

  private addNodo(){
    this.map.on('click', (e: LeafletMouseEvent) => {
      const lat = this.roundTo(e.latlng.lat,4);
      const lng = this.roundTo(e.latlng.lng,4);
      if(this.statusStart()){
        this.start.set(
          { longitud: lng, latitud: lat }
        )
      }else if (!this.statusStart() && this.statusEnd()){
        this.end.set(
          { longitud: lng, latitud: lat }
        )
      }
    })

  }


  private roundTo = function(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };


}
