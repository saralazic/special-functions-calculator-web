import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpecialFunction } from 'src/app/services/functions/specialFunction';
import { LanguageService } from 'src/app/services/language-service/language.service';
import { createChosenFunction } from 'src/utilities/utilities';

@Component({
  selector: 'app-function-information',
  templateUrl: './function-information.component.html',
  styleUrls: ['./function-information.component.css'],
})
export class FunctionInformationComponent {
  private subscription?: Subscription;
  spef?: SpecialFunction;
  parameter: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.parameter = this.route.snapshot.paramMap.get('parameter');
    this.spef = createChosenFunction(this.parameter ?? '');
    this.loadTranslations();

    this.subscription = this.languageService
      .getLanguageChangeObservable()
      .subscribe(() => {
        this.loadTranslations();
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
        this.spef?.loadTranslations(translations);
      });
  }
}
