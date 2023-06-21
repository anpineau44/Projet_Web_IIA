import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  constructor(private http: HttpClient, private notifierService: NotifierService) {}
  
  email: string = ''; // Valeur par défaut ou initialisation

  emailInit(): void {

    this.http.post(`https://localhost:7085/api/Authentification/password-reset?email=${this.email}`, null).subscribe(
      (response: any) => {
        this.notifierService.notify('success','Reinitialisation envoyé par mail')
      },
      (error: any) => {
        this.notifierService.notify('error','Email non trouvé')
      }
    );
  }
}
