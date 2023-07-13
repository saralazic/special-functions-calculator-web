import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  greeting?: string;
  message?: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTranslations('en.json'); // Load English translations by default
  }

  loadTranslations(lang: string) {
    this.http.get(`./assets/i18n/${lang}`).subscribe((translations: any) => {
      this.greeting = translations.greeting;
      this.message = translations.message;
    });
  }
}
