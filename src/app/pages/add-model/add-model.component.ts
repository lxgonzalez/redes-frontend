import {AfterViewInit, Component, input, signal} from '@angular/core';
import * as L from "leaflet";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from '@angular/material/input';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatToolbar} from "@angular/material/toolbar";
import 'leaflet-routing-machine';
import {RouterLink} from "@angular/router";
import {MatSelectModule} from '@angular/material/select';
import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import {GeocodingService} from "../../service/geocoding.service"; // Import LRM styles
import 'leaflet-routing-machine';
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
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatTableModule, MatToolbar, RouterLink,MatSelectModule],
  templateUrl: './add-model.component.html',
  styleUrl: './add-model.component.css'
})
export class AddModelComponent implements AfterViewInit{

  private map: any;
  nodes = signal<any[]>([])

  private connections: any[] = [];
  private selectedNode: any = null;
  private sourceNode: any = null;
  private destinationNode: any = null;
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

  constructor(private geocodingService: GeocodingService) { }

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
    this.nodes().push({ latlng, marker: newNode });

    this.geocodingService.reverseGeocode(latlng.lat, latlng.lng).subscribe((data: any) => {
      newNode.bindPopup(data.display_name).openPopup();
      this.nodes()[this.nodes().length - 1].address = data.display_name;
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
    const color = this.colors[this.connections.length % this.colors.length]; // Select a color
    L.Routing.control({
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
      collapsible: true
    }).addTo(this.map);

    this.connections.push({
      start: { latlng: start, address: startNode?.address },
      end: { latlng: end, address: endNode?.address },
      distance: this.calculateDistance(start, end)
    });

    this.dataSource.data = [...this.connections];

  }

  private calculateDistance(start: any, end: any): number {
    const lat1 = start.lat;
    const lon1 = start.lng;
    const lat2 = end.lat;
    const lon2 = end.lng;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  resetSelection(): void {
    this.selectedNode = null;
  }

  selectSourceNode(event: any): void {
    const selectedValue = event.target.value;
    this.sourceNode = this.nodes().find(node => node.latlng === selectedValue);
  }

  selectDestinationNode(event: any): void {
    const selectedValue = event.target.value;
    this.destinationNode = this.nodes().find(node => node.latlng === selectedValue);
  }

  protected imprimir (){
    this.connections.forEach(connection => {
      console.log(connection)
    })
  }
}
