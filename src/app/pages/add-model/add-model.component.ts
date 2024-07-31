import {AfterViewInit, Component, input, signal} from '@angular/core';
import * as L from "leaflet";
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from '@angular/material/input';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatToolbar} from "@angular/material/toolbar";
import {MatSelectModule} from '@angular/material/select';
import {Router, RouterLink} from "@angular/router";

import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

import {ArbolExpansion, Connection, Node, RouteData, RutaCorta} from "../../model/nodo";
import {ResultadosComponent} from "../resultados/resultados.component";
import {RutaCortaService} from "../../service/ruta-corta.service";
import {GeocodingService} from "../../service/geocoding.service";
import {ArbolExpansionService} from "../../service/arbol-expansion.service";
import {forkJoin} from "rxjs";

declare module "leaflet" {
  namespace Routing {
    interface RoutingControlOptions {
      createMarker?: ((i: number, wp: Waypoint, nWps: number) => Marker | false) | undefined;
    }
  }
}
@Component({
  selector: 'app-add-model',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatTableModule, MatToolbar, RouterLink, MatSelectModule, FormsModule, ResultadosComponent],
  templateUrl: './add-model.component.html',
  styleUrl: './add-model.component.css'
})
export class AddModelComponent implements AfterViewInit{

  private map: any;
  nodes = signal<Node[]>([])
  rutaCorta = new RutaCorta()

  arbolExpansion = new ArbolExpansion()


  private connections: Connection[] = [];
  private selectedNode: any = null;
  protected sourceNode: Node | null = null;
  protected destinationNode: Node | null = null;
  private colors: string[] = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF', '#33FFF5',
    '#FFC300', '#808080', '#FFA500', '#800080', '#008000', '#0000FF',
    '#FF0000', '#FFFF00', '#00FFFF', '#800000', '#C0C0C0', '#F0FFFF',
    '#F0F8FF', '#FAF0E6', '#FFDAB9', '#E6E6FA', '#FF00FF', '#808000',
    '#00FF00', '#FFFFF0', '#FF8C00', '#4B0082', '#2F4F4F', '#00CED1',
  '#9400D3', '#FF1493', '#00BFFF', '#696969', '#B22222', '#FFA07A',
  '#20B2AA', '#87CEEB', '#6A5ACD', '#7FFF00', '#D2691E', '#008B8B',
  '#00008B', '#006400', '#8B0000', '#556B2F', '#FF8C00', '#9932CC',
  '#8B008B', '#E32B71', '#FA8072', '#F4A460', '#2E8B57', '#5F9EA0']

  displayedColumns: string[] = ['parada1', 'parada2', 'distancia'];
  dataSource = new MatTableDataSource<any>(this.connections);
  private routeData: RouteData;

  constructor(private geocodingService: GeocodingService,
              private http: HttpClient,private router: Router,
              private rutacortaService: RutaCortaService,
              private arbolService: ArbolExpansionService) { }

  ngAfterViewInit(): void {
    this.initMap()
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-0.22,-78.50],
      zoom: 14
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 50,
      minZoom: 3,
    });
    tiles.addTo(this.map);

    this.map.on('click', (e: any) => {
      this.addNode(e.latlng);
    });
  }

  private addNode(latlng: any): void {
    const newNode = L.marker(latlng, { draggable: true }).addTo(this.map);
    const node: Node = {latlng, address:''}
    this.nodes().push(node);

    this.geocodingService.reverseGeocode(latlng.lat, latlng.lng).subscribe((data: any) => {
      // newNode.bindPopup(data.display_name).openPopup();
      node.address = data.display_name;
    });

    newNode.on('click', () => {
      this.selectNode(newNode, latlng);
    });
  }

  private selectNode(marker: any, latlng: any): void {
    if (this.selectedNode) {
      this.addConnection(this.selectedNode, latlng);
      this.selectedNode = null;
    } else {
      this.selectedNode = latlng;
    }
  }

  private addConnection(start: any, end: any): void {
    const startNode = this.nodes().find(node => node.latlng === start);
    const endNode = this.nodes().find(node => node.latlng === end);
    const color = this.colors[this.connections.length % this.colors.length];

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      lineOptions: {
        styles: [{ color: color, weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      },
      createMarker: (i, wp, nWps) => {
        return null;
      },
      show: false,
      collapsible: true,
      fitSelectedRoutes: false
    }).addTo(this.map);

    routingControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      // Ordenar las rutas por distancia y tomar la primera
      const shortestRoute = routes.sort((a: any, b: any) => a.summary.totalDistance - b.summary.totalDistance)[0];
      const summary = shortestRoute.summary;
      const distance = summary.totalDistance / 1000;

      this.connections.push({
        start: startNode!,
        end: endNode!,
        distance: (Math.round(distance * 100) / 100).toFixed(2)
      });

      this.dataSource.data = [...this.connections];

      // Añadir la ruta más corta al mapa
      L.Routing.control({
        waypoints: shortestRoute.inputWaypoints.map((wp: any) => L.latLng(wp.latLng.lat, wp.latLng.lng)),
        lineOptions: {
          styles: [{ color: color, weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 10
        },
        createMarker: (i, wp, nWps) => {
          return null;
        },
        show: false,
        collapsible: true,
        fitSelectedRoutes: false
      }).addTo(this.map);
    });
  }

  buscarPython(): void {
    if (this.sourceNode && this.destinationNode) {
      this.routeData = {
        connections: this.connections,
        sourceNode: this.sourceNode,
        destinationNode: this.destinationNode
      };

      // Define the HTTP requests
      const rutaCortaRequest = this.http.post<RutaCorta>('http://localhost:5000/ruta-corta', this.routeData);
      const arbolExpansionRequest = this.http.post<ArbolExpansion>('http://localhost:5000/arbol-expansion', this.routeData);

      forkJoin([rutaCortaRequest, arbolExpansionRequest]).subscribe(
        ([rutaCortaResponse, arbolExpansionResponse]) => {
          // Validate RutaCorta response
          if (rutaCortaResponse && rutaCortaResponse.path && Array.isArray(rutaCortaResponse.path)) {
            this.rutaCorta = rutaCortaResponse;
            this.rutacortaService.setRutaCorta(this.rutaCorta);
          } else {
            console.error('Invalid RutaCorta response data:', rutaCortaResponse);
          }

          // Validate ArbolExpansion response
          if (arbolExpansionResponse && arbolExpansionResponse.path && Array.isArray(arbolExpansionResponse.path)) {
            this.arbolExpansion = arbolExpansionResponse;
            this.arbolService.setArbolExpansion(this.arbolExpansion);
          } else {
            console.error('Invalid ArbolExpansion response data:', arbolExpansionResponse);
          }

          // Navigate to 'resultados'
          this.router.navigate(['resultados']);
        },
        error => {
          // Handle any errors from the HTTP requests
          console.error('Error fetching data:', error);
        }
      );
    }
  }

}
