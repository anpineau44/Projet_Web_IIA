import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.css']
})
export class ExtractComponent {
  data: any[] = [];

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    this.http.get<any[]>('https://localhost:7085/api/Authentification/extractCa', { headers: { Authorization: `Bearer ${token}` } }).subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.log('Erreur lors de la récupération des données:', error);
      }
    );
  }
}
