import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language-service/language.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  private subscription?: Subscription;

  head_1?: string;
  head_2?: string;
  bessel_1?: string;
  bessel_2?: string;
  bessel_3?: string;
  laguerre?: string;
  legendre?: string;
  jacobi?: string;
  chebyshev_1?: string;
  chebyshev_2?: string;

  constructor(
    private http: HttpClient,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadTranslations();
    this.subscription = this.languageService
      .getLanguageChangeObservable()
      .subscribe(() => {
        this.loadTranslations(); // Load translations whenever language changes
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  loadTranslations() {
    const selectedLanguage = this.languageService.getSelectedLanguage();
    this.http
      .get(`./assets/i18n/${selectedLanguage}.json`)
      .subscribe((translations: any) => {
        this.head_1 = translations.homepage.head_1;
        this.head_2 = translations.homepage.head_2;
        this.bessel_1 = translations.homepage.bessel_1;
        this.bessel_2 = translations.homepage.bessel_2;
        this.bessel_3 = translations.homepage.bessel_3;
        this.laguerre = translations.homepage.laguerre;
        this.legendre = translations.homepage.legendre;
        this.jacobi = translations.homepage.jacobi;
        this.chebyshev_1 = translations.homepage.chebyshev_1;
        this.chebyshev_2 = translations.homepage.chebyshev_2;
      });
  }
}
