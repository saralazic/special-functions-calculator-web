import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BesselFirstKind } from 'src/app/models/functions/besselFirst';
import { SpecialFunction } from 'src/app/models/specialFunction';
import { LanguageService } from 'src/app/services/language-service/language.service';
import {
  checkIfBigNumberIsPrecision,
  drawGraph,
} from 'src/utilities/utilities';

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
  valueBig?: string;
  name?: string;

  currentCalculatedValue: string;

  shouldShowCalculator: boolean;
  useCalculatorOnVariable: boolean;

  calculatorIconPath = 'assets/icons/calculator.svg';

  calculatorError?: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private languageService: LanguageService,
    private formBuilder: FormBuilder
  ) {
    this.shouldShowCalculator = false;
    this.useCalculatorOnVariable = true;
    this.currentCalculatedValue = '';
  }

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

  bigNumberValidator(control: AbstractControl): ValidationErrors | null {
    const bigNumberRegex = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;
    if (control.value && !bigNumberRegex.test(control.value)) {
      return { invalidBigNumber: true };
    }
    return null;
  }

  bigNumberValidatorForPrecision(
    control: AbstractControl
  ): ValidationErrors | null {
    const precisionNumberRegex = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;

    if (!control.value || !precisionNumberRegex.test(control.value)) {
      return { invalidPrecisionNumber: true };
    }

    if (!checkIfBigNumberIsPrecision(control.value)) {
      return { invalidPrecisionNumber: true };
    }

    return null;
  }

  createForm() {
    this.form = this.formBuilder.group({
      positiveIntegerValue: [
        null,
        [Validators.required, Validators.pattern(/^[0-9]\d*$/)],
      ],
      precisionValue: [
        '',
        [Validators.required, this.bigNumberValidatorForPrecision],
      ],
      realNumberValue: ['', [Validators.required, this.bigNumberValidator]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { positiveIntegerValue, precisionValue } = this.form.value;
      const realNumberValue = parseFloat(
        this.form.get('realNumberValue')?.value || '0'
      );

      this.valueBig = this.spef?.calculateBig(
        positiveIntegerValue,
        precisionValue,
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

  showCalculator(onVariable: boolean) {
    if (this.useCalculatorOnVariable === onVariable)
      this.shouldShowCalculator = !this.shouldShowCalculator;
    else this.currentCalculatedValue = '';

    this.useCalculatorOnVariable = onVariable;
  }

  onCalculated(value: string): void {
    this.currentCalculatedValue = value;
  }

  useCalculatedValue(): void {
    if (this.useCalculatorOnVariable) {
      const controlName = 'realNumberValue';
      const control = this.form.get(controlName);
      const newValue = this.currentCalculatedValue;

      this.form.patchValue({
        [controlName]: newValue,
      });

      // Trigger validation on the control
      control?.updateValueAndValidity();

      // If the control is still invalid after validation, display the error message
      if (control?.invalid && control?.touched) {
        const errors = control?.errors;
        console.error('Validation error:', errors);
      }
    } else {
      const controlName = 'precisionValue';
      const control = this.form.get(controlName);
      const newValue = this.currentCalculatedValue;

      this.form.patchValue({
        [controlName]: newValue,
      });

      // Trigger validation on the control
      control?.updateValueAndValidity();

      // If the control is still invalid after validation, display the error message
      if (control?.invalid && control?.touched) {
        const errors = control?.errors;
        console.error('Validation error:', errors);
      }
    }
  }

  useCalcValDisabled(): boolean {
    if (this.currentCalculatedValue.length < 1) return true;
    if (this.useCalculatorOnVariable) return false;

    const precisionNumberRegex =
      /^(0(\.\d+)?|0\.\d+|([0-9]\d*(\.\d+)?(e-?\d+)?))$/i;

    return !precisionNumberRegex.test(this.currentCalculatedValue);
  }
}
