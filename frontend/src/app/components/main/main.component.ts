import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PublicationsService } from 'src/app/services/publications.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private service: PublicationsService, private cookie: CookieService) {
  }

  publications = []
  ngOnInit(): void {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['login']);
    }
    const token = this.cookie.get('token')
    this.service.findAll(token).subscribe((result) => {
      console.log('result', result)
      this.publications = result
    },
      (error) => {
        console.log('error', error)
      });
  }

}
