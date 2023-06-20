import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  oldPassword: string = '';
  newPassword: string = '';

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService, private notifierService: NotifierService) { }

  changePassword(): void {
    const apiUrl = 'https://localhost:7085/api/Authentification/change-password';
    const token = this.tokenService.getToken();

    const body = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.http.post(apiUrl, body, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((response: any) => {
        this.notifierService.notify('success', 'Le mot de passe a été modifié avec succès.');
        this.oldPassword = '';
        this.newPassword = '';
      }, (error) => {
        this.notifierService.notify('warning', 'Erreur lors de la modification du mot de passe.');
      });
  }
}
