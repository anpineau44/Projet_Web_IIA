import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { TokenService } from '../token.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.css']
})
export class ExtractComponent {
  data: any[] = [];
  DateDebut!: string;
  DateFin!: string;
  Region!: string;
  Vendeur!: string;

  constructor(private http: HttpClient, private tokenService: TokenService, private notifierService: NotifierService) { }

  ngOnInit(): void {

  }

  appliquerFiltres() {
    const token = this.tokenService.getToken();

    // Construire la partie fixe de l'URL
    let url = 'https://localhost:7085/api/Authentification/extractCa?';

    // Vérifier chaque filtre et ajouter à l'URL seulement s'ils ont une valeur
    if (this.DateDebut) {
      url += `startDate=${encodeURIComponent(this.DateDebut)}&`;
    }
    if (this.DateFin) {
      url += `endDate=${encodeURIComponent(this.DateFin)}&`;
    }
    if (this.Region) {
      url += `region=${encodeURIComponent(this.Region)}&`;
    }
    if (this.Vendeur) {
      url += `vendeur=${encodeURIComponent(this.Vendeur)}&`;
    }

    // Supprimer le dernier caractère '&' s'il existe
    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }

    this.http.get<any[]>(url, { headers: { Authorization: `Bearer ${token}` } }).subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        this.notifierService.notify('error', 'Erreur lors de la récupération des données, champs invalide');
      }
    );
  }
}
