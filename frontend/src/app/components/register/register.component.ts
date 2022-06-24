import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  identifiant: string = '';
  motDePasse: string = '';

  constructor(private service: UtilisateurService, private cookie: CookieService, private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(): void {
    this.service.Register(this.identifiant, this.motDePasse).subscribe((result) => {
      sessionStorage.setItem('userId', result.userId)
      this.cookie.set('token', result.token)
      this.router.navigate([''])

    }
      , (error) => {
        console.log('error', error);
      }
    )
  }

}












