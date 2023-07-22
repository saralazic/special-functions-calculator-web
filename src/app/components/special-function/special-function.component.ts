import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BesselFirstKind } from 'src/app/models/bessel';
import { SpecialFunction } from 'src/app/models/specialFunction';
import { LanguageService } from 'src/app/services/language-service/language.service';
import { drawGraph } from 'src/utilities/utilities';

@Component({
  selector: 'app-special-function',
  templateUrl: './special-function.component.html',
  styleUrls: ['./special-function.component.css'],
})
export class SpecialFunctionComponent implements OnInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  private subscription?: Subscription;
  private spef?: SpecialFunction;
  form!: FormGroup;
  parameter: string | null = null;
  value?: number;
  name?: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private languageService: LanguageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.spef = new BesselFirstKind();
    this.loadTranslations();

    this.subscription = this.languageService
      .getLanguageChangeObservable()
      .subscribe(() => {
        this.loadTranslations(); // Load translations whenever language changes
      });

    this.parameter = this.route.snapshot.paramMap.get('parameter');
    // Use the 'parameter' value to fetch and display the corresponding data
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  drawGraphic(n: number, eps: number) {
    const xArr = Array.from({ length: 201 }, (_, index) => index * 0.05);
    const yArr = xArr.map((x) => this.spef?.calculate(n, eps, x) ?? 0);

    drawGraph(this.graphContainer?.nativeElement, xArr, yArr);
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

  createForm() {
    this.form = this.formBuilder.group({
      positiveIntegerValue: [
        null,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      precisionValue: [0.000001, [Validators.required, Validators.min(0)]],
      realNumberValue: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { positiveIntegerValue, precisionValue } = this.form.value;
      const realNumberValue = parseFloat(
        this.form.get('realNumberValue')?.value || '0'
      );

      this.value = this.spef?.calculate(
        positiveIntegerValue,
        precisionValue,
        realNumberValue
      );

      this.drawGraphic(positiveIntegerValue, precisionValue);
    }
  }
}
