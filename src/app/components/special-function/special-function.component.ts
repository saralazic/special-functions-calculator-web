import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FUNCTION_TYPE } from 'src/app/data/constants';
import {
  FunctionParams,
  SpecialFunction,
} from 'src/app/models/specialFunction';
import { LanguageService } from 'src/app/services/language-service/language.service';
import { createChosenFunction, drawGraph } from 'src/utilities/utilities';

@Component({
  selector: 'app-special-function',
  templateUrl: './special-function.component.html',
  styleUrls: ['./special-function.component.css'],
})
export class SpecialFunctionComponent implements OnInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef;

  private subscription?: Subscription;
  private spef?: SpecialFunction;
  parameter: string | null = null;
  value?: number;
  valueBig?: string;
  name?: string;

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
        this.loadTranslations(); // Load translations whenever language changes
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  drawGraphic(n: number, eps: number) {
    const { xArr, yArr } = this.generateCoordinates(n, eps);
    drawGraph(this.graphContainer?.nativeElement, xArr, yArr);
  }

  generateCoordinates(n: number, eps: number) {
    if (
      this.parameter === FUNCTION_TYPE.LEGENDRE_POLYNOMIAL ||
      this.parameter === FUNCTION_TYPE.CHEBYSHEV_FIRST_KIND ||
      this.parameter === FUNCTION_TYPE.CHEBYSHEV_SECOND_KIND
    ) {
      const startValue: number = -0.999999;
      const endValue: number = 0.999999;
      const numParameters: number = 201;

      const step: number = (endValue - startValue) / (numParameters - 1);
      const xArr: number[] = Array.from(
        { length: numParameters },
        (_, index) => startValue + index * step
      );

      const yArr = xArr.map(
        (x) =>
          this.spef?.calculate({
            alpha: n,
            x: x,
            eps: eps,
          }) ?? 0
      );

      return { xArr, yArr };
    }

    const xArr = Array.from({ length: 201 }, (_, index) => index * 0.05);
    const yArr = xArr.map(
      (x) =>
        this.spef?.calculate({
          alpha: n,
          x: x,
          eps: eps,
        }) ?? 0
    );

    return { xArr, yArr };
  }

  loadTranslations() {
    const selectedLanguage = this.languageService.getSelectedLanguage();
    this.http
      .get(`./assets/i18n/${selectedLanguage}.json`)
      .subscribe((translations: any) => {
        let spefTranslations = this.spef?.loadTranslations(translations);
        this.name = spefTranslations?.name;
      });
  }

  onFormValuesChanged(data: FunctionParams) {
    if (data) {
      this.valueBig = this.spef?.calculateBig(data.bignumber);

      this.value = this.spef?.calculate(data.real);

      this.drawGraphic(data.real.alpha, data.real.eps);
    }
  }
}
