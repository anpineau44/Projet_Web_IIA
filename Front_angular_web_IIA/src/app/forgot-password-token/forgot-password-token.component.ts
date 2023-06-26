import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-forgot-password-token',
  templateUrl: './forgot-password-token.component.html',
  styleUrls: ['./forgot-password-token.component.css']
})
export class ForgotPasswordTokenComponent {
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private notifierService: NotifierService) { }

  newPassword: string = '';
  newPassword2: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const token = params.get('token');
      const url = `https://localhost:7085/api/Authentification/password-reset-valide-token?token=${token}`;
      this.http.get(url).subscribe(
        (response: any) => {
          console.log("token Ok")
        },
        (error) => {
          this.router.navigate(['/login']);
        }
      );;
    });
  }

  changePassword(): void {
    console.log("test");
    // Vérifier que les deux nouveaux mots de passe correspondent
    if (this.newPassword !== this.newPassword2) {
      this.notifierService.notify('error', 'Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    // Obtenir le jeton depuis l'URL
    const token = this.route.snapshot.paramMap.get('token');

    // Construire l'URL de la méthode dans votre backend
    const url = `https://localhost:7085/api/Authentification/password-reset/${token}?newPassword=${this.newPassword}`;

    // Effectuer la requête HTTP POST vers l'URL
    this.http.post(url, null).subscribe(
      (response: any) => {
        console.log('Mot de passe réinitialisé avec succès');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Erreur lors de la réinitialisation du mot de passe', error);
        this.notifierService.notify('error', 'token expiré');
      }
    );
  }
}
