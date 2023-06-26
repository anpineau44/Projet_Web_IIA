import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  email!: string;

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken()
    if(token){
      this.getEmailFromToken(token);
    }else{
      this.router.navigate(['/login']);
    }
  }

  getEmailFromToken(token: string): void {
    const apiUrl = 'https://localhost:7085/api/Authentification/get-email-from-token';

    this.http.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((response: any) => {
        this.email = response.email;
      }, (error) => {
        this.router.navigate(['/login']);
      });
  }

  deconnexion(): void {
    this.tokenService.removeToken();
  }
  
}
