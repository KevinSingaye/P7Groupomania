import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { LoginComponent } from '../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  path = 'http://localhost:3000/api/auth'
  constructor(private http: HttpClient) {

  }
  Login(identifiant: string, password: string): Observable<any> {
    const body = { email: identifiant, password }
    return this.http.post(this.path + '/login', body);

  }
}
