import { Routes } from '@angular/router';
import {AddModelComponent} from "./pages/add-model/add-model.component";
import {ResultadosComponent} from "./pages/resultados/resultados.component";

export const routes: Routes = [
  { path:  '', component: AddModelComponent },
  { path:  'resultados', component: ResultadosComponent },
];
