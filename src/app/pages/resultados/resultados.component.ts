import {Component, input, OnInit} from '@angular/core';

import L from "leaflet";
import 'leaflet/dist/leaflet.css';

import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatCardTitle} from "@angular/material/card";
import {MatCardModule} from '@angular/material/card';
import {MatButton} from "@angular/material/button";

import {ArbolExpansion, RutaCorta} from "../../model/nodo";
import {RutaCortaService} from "../../service/ruta-corta.service";
import {map} from "rxjs";
import {ArbolExpansionService} from "../../service/arbol-expansion.service";

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbar,
    MatCardTitle,
    MatToolbarRow,
    MatButton
  ],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent implements OnInit{

  private mapRutaCorta: any;
  private mapArbol: any;


  rutaCorta: RutaCorta
  arbolExpansion: ArbolExpansion

  constructor(private rutaCortaService: RutaCortaService,
              private arbolExpansionService: ArbolExpansionService) { }

  ngOnInit(): void {
    this.rutaCorta = this.rutaCortaService.getRutaCorta()
    this.arbolExpansion = this.arbolExpansionService.getArbolExpansion()

    this.initMapRutaCorta()
    this.initMapArbol()
  }

  initMapRutaCorta(){
    this.mapRutaCorta = L.map('mapRutaCorta', {
      center: [-0.22, -78.50],
      zoom: 14
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 50,
      minZoom: 3,
    });
    tiles.addTo(this.mapRutaCorta);

    for(let i = 0; i < this.rutaCorta.path.length; i++){
      let ruta = this.rutaCorta.path[i];
      let rutaP = this.rutaCorta.path[i+1];

      L.marker([ruta.latlng.lat, ruta.latlng.lng]).addTo(this.mapRutaCorta);

      if(this.rutaCorta.path[i+1] != undefined){
        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(ruta.latlng.lat, ruta.latlng.lng),
            L.latLng(rutaP.latlng.lat, rutaP.latlng.lng)
          ],
          lineOptions: {
            styles: [{ color: 'blue', weight: 4 }],
            extendToWaypoints: true,
            missingRouteTolerance: 50
          },
          createMarker: (i, wp, nWps) => {
            return null;
          },
          show: false,
          collapsible: true,
          fitSelectedRoutes: false
        }).addTo(this.mapRutaCorta);

        routingControl.on('routesfound', (e: any) => {
          const routes = e.routes;
          const shortestRoute = routes.sort((a: any, b: any) => a.summary.totalDistance - b.summary.totalDistance)[0];

          L.Routing.control({
            waypoints: shortestRoute.inputWaypoints.map((wp: any) => L.latLng(wp.latLng.lat, wp.latLng.lng)),
            lineOptions: {
              styles: [{ color: 'blue', weight: 4 }],
              extendToWaypoints: true,
              missingRouteTolerance: 50
            },
            createMarker: (i, wp, nWps) => {
              return null;
            },
            show: false,
            collapsible: true,
            fitSelectedRoutes: false
          }).addTo(this.mapRutaCorta);
        });
      }
    }
  }


  initMapArbol() {
    this.mapArbol = L.map('mapArbol', {
      center: [-0.22, -78.50],
      zoom: 14
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3
    });
    tiles.addTo(this.mapArbol);

    // Dibujar los nodos y conexiones del árbol de expansión
    for (let i = 0; i < this.arbolExpansion.path.length; i++) {
      const connection = this.arbolExpansion.path[i];
      const startLatLng: [number, number] = [connection.start.latlng.lat, connection.start.latlng.lng];
      const endLatLng: [number, number] = [connection.end.latlng.lat, connection.end.latlng.lng];

      L.marker(startLatLng).addTo(this.mapArbol);
      L.marker(endLatLng).addTo(this.mapArbol);

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startLatLng[0], startLatLng[1]),
          L.latLng(endLatLng[0], endLatLng[1])
        ],
        lineOptions: {
          styles: [{ color: 'green', weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 50
        },
        createMarker: (i, wp, nWps) => {
          return null;
        },
        show: false,
        collapsible: true,
        fitSelectedRoutes: false
      }).addTo(this.mapArbol);
    }
  }

}














