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
    const url = 'https://localhost:7085/api/Authentification/password-reset';
    const body = { email: this.email };

    this.http.post(url, body, { observe: 'response' }).subscribe(
      (response: HttpResponse<any>) => {
        if (response.status === 204) {
          this.notifierService.notify('success','Email envoyé avec succès');
          console.log('Password reset request successful with NoContent response');
        } else {
          this.notifierService.notify('error','Unexpected response status')
          console.log('Unexpected response status:', response.status);
        }
      },
      (error: any) => {
        if (error.status === 404) {
          this.notifierService.notify('error','Email non trouvé')
        }
      }
    );
  }

    // const payload = { email: this.email};
  //   this.http.post('https://localhost:7085/api/Authentification/password-reset', payload).subscribe(
  //     (response: any) => {
  //       this.notifierService.notify('success','OK');
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.notifierService.notify('error','Error')
  //     }
  //   );
  // }
}
