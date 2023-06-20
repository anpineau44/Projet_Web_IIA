import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {}
  
  username: string = ''; // Valeur par défaut ou initialisation
  password: string = ''; // Valeur par défaut ou initialisation

  login(): void {
    const payload = { email: this.username, password: this.password };

    this.http.post('https://localhost:7085/api/Authentification/login', payload).subscribe(
      (response: any) => {
        // Vérifier si la réponse a un statut de succès
        if (response && response.token) {
          const token = response.token;
          this.tokenService.setToken(token);
          this.router.navigate(['/home']);
        } else {
          console.error('Erreur lors de la connexion : Réponse invalide');
        }
      },
      (error: HttpErrorResponse) => {
        // Vérifier si la réponse a un statut d'erreur
        if (error && error.status === 401) {
          console.error('Erreur lors de la connexion : Identifiants invalides');
        } else {
          console.error('Erreur lors de la connexion :', error);
        }
      }
    );
  }
}
