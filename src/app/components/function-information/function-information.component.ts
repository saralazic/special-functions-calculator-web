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
  definitionUrls: string[] = [];
  graphUrl: string = '';
  domainUrl: string = '';
  relationsUrl: string[] = [];
  equationUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.parameter = this.route.snapshot.paramMap.get('parameter');
    this.spef = createChosenFunction(this.parameter ?? '');
    this.generatePhotoUrls();
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

  generatePhotoUrls() {
    const baseUrl = '../../../assets/functions';
    const definitionsCnt = this.parameter === 'hermite2' ? 1 : 3;
    for (let i = 1; i <= definitionsCnt; i++) {
      this.definitionUrls.push(
        `${baseUrl}/definitions/${this.parameter}_${i}.png`
      );
    }

    const relationsCnt = this.parameter === 'hermite2' ? 2 : 4;
    for (let i = 1; i <= relationsCnt; i++) {
      this.relationsUrl.push(`${baseUrl}/relations/${this.parameter}_${i}.png`);
    }

    this.graphUrl = `${baseUrl}/graphs/${this.parameter}.png`;
    this.equationUrl = `${baseUrl}/equations/${this.parameter}.png`;
    this.domainUrl = `${baseUrl}/domains/${this.parameter}.png`;

    console.log(this.definitionUrls);
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
