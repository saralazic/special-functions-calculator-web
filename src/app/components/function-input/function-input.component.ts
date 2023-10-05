import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FunctionType, InputType } from 'src/app/models/enums';
import {
  FunctionParams,
  FunctionParamsForCalculation,
  FunctionParamsForCalculationWithBigNumbers,
} from 'src/app/models/specialFunction';
import { LanguageService } from 'src/app/services/language-service/language.service';
import { BIG_NUMBER_CONSTANTS, math_64 } from 'src/utilities/big_numbers_math';
import { checkIfBigNumberIsPrecision } from 'src/utilities/utilities';

@Component({
  selector: 'app-function-input',
  templateUrl: './function-input.component.html',
  styleUrls: ['./function-input.component.css'],
})
export class FunctionInputComponent implements OnInit {
  @Output() formValuesChanged = new EventEmitter<any>();
  @Input() parameter: string | null = null;

  private subscription?: Subscription;

  form!: FormGroup;

  labelOrderNatural: string = '';
  labelOrderReal: string = '';
  labelPrecision: string = '';
  labelVariable: string = '';
  labelVariableN0: string = '';
  aInputLabel: string = '';
  bInputLabel: string = '';
  labelVariableConstrained: string = '';
  errorMessage: string = '';
  basicInformationsLabel: string = '';
  useCalculatedValueLabel: string = '';
  calculateAndDrawLabel: string = '';

  currentCalculatedValue: string;

  shouldShowCalculator: boolean;
  whereToUseCalculatedValue: InputType | null;

  calculatorIconPath = 'assets/icons/calculator.svg';

  calculatorError?: string;

  orderInputReal: IInput;
  orderInputNatural: IInput;
  precisionInput: IInput;
  variableInput: IInput;
  variableInputConstrained: IInput;
  variableInputN0: IInput;
  aInput: IInput;
  bInput: IInput;

  inputs: IInput[] = [];

  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.shouldShowCalculator = false;
    this.whereToUseCalculatedValue = null;
    this.currentCalculatedValue = '';

    this.orderInputReal = {
      label: this.labelOrderReal,
      formControlName: 'orderValue',
      isInvalid:
        "form.get('orderValue')?.invalid && form.get('orderValue')?.touched",
      error: this.errorMessage,
      inputType: InputType.ORDER,
    };

    this.orderInputNatural = {
      label: this.labelOrderNatural,
      formControlName: 'orderValue',
      isInvalid:
        "form.get('orderValue')?.invalid && form.get('orderValue')?.touched",
      error: this.errorMessage,
      inputType: InputType.ORDER,
    };

    this.precisionInput = {
      label: this.labelPrecision,
      formControlName: 'precisionValue',
      isInvalid:
        "form.get('precisionValue')?.invalid && form.get('precisionValue')?.touched",
      error: this.errorMessage,
      inputType: InputType.PRECISION,
    };

    this.variableInput = {
      label: this.labelVariable,
      formControlName: 'variableValue',
      isInvalid:
        "form.get('variableValue')?.invalid && form.get('variableValue')?.touched",
      error: this.errorMessage,
      inputType: InputType.VARIABLE,
    };

    this.variableInputConstrained = {
      label: this.labelVariableConstrained,
      formControlName: 'variableValue',
      isInvalid:
        "form.get('variableValue')?.invalid && form.get('variableValue')?.touched",
      error: this.errorMessage,
      inputType: InputType.VARIABLE,
    };

    this.variableInputN0 = {
      label: this.labelVariableN0,
      formControlName: 'variableValue',
      isInvalid:
        "form.get('variableValue')?.invalid && form.get('variableValue')?.touched",
      error: this.errorMessage,
      inputType: InputType.VARIABLE,
    };

    this.aInput = {
      label: this.aInputLabel,
      formControlName: 'aParameterValue',
      isInvalid:
        "form.get('aParameterValue')?.invalid && form.get('aParameterValue')?.touched",
      error: this.errorMessage,
      inputType: InputType.ALPHA,
    };

    this.bInput = {
      label: this.bInputLabel,
      formControlName: 'bParameterValue',
      isInvalid:
        "form.get('bParameterValue')?.invalid && form.get('bParameterValue')?.touched",
      error: this.errorMessage,
      inputType: InputType.BETA,
    };
  }

  ngOnInit() {
    this.parameter = this.route.snapshot.paramMap.get('parameter');
    this.assignInput();
    this.loadTranslations();
    this.createForm();

    this.subscription = this.languageService
      .getLanguageChangeObservable()
      .subscribe(() => {
        this.loadTranslations();
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const orderValue = this.form.get('orderValue')?.value || '0';
      const precisionValue = this.form.get('precisionValue')?.value || '1e-64';
      const variableValue = this.form.get('variableValue')?.value || '0';
      const paramAlpha = this.form.get('aParameterValue')?.value || '0';
      const paramBeta = this.form.get('bParameterValue')?.value || '0';

      const paramsBig = {
        alphaBig: orderValue,
        epsBig: precisionValue,
        xBig: variableValue,
        a: paramAlpha,
        b: paramBeta,
      } as FunctionParamsForCalculationWithBigNumbers;

      const paramsR = {
        alpha: +orderValue,
        eps: +precisionValue,
        x: +variableValue,
        a: +paramAlpha,
        b: +paramBeta,
      } as FunctionParamsForCalculation;

      const params = {
        real: paramsR,
        bignumber: paramsBig,
      } as FunctionParams;

      this.formValuesChanged.emit(params);
    }
  }

  bigNumberValidator(control: AbstractControl): ValidationErrors | null {
    const bigNumberRegex = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;
    if (control.value && !bigNumberRegex.test(control.value)) {
      return { invalidBigNumber: true };
    }
    return null;
  }

  bigNumberValidatorNatural(control: AbstractControl): ValidationErrors | null {
    const bigNumberRegex = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;
    if (control.value && !bigNumberRegex.test(control.value)) {
      return { invalidBigNumber: true };
    }

    let nBig = math_64.bignumber(control.value);
    if (!(math_64.isInteger(nBig) && math_64.isPositive(nBig))) {
      return { invalidBigNumber: true };
    }

    return null;
  }

  bigNumberValidatorN0(control: AbstractControl): ValidationErrors | null {
    const bigNumberRegex = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;
    if (control.value && !bigNumberRegex.test(control.value)) {
      return { invalidBigNumber: true };
    }

    let nBig = math_64.bignumber(control.value);
    if (!(math_64.isInteger(nBig) && !math_64.isNegative(nBig))) {
      return { invalidBigNumber: true };
    }

    return null;
  }

  bigNumberValidatorForParams(
    control: AbstractControl
  ): ValidationErrors | null {
    const bigNumberRegex = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;
    if (control.value && !bigNumberRegex.test(control.value)) {
      return { invalidBigNumber: true };
    }

    let k = math_64.bignumber(control.value);
    if (!(Number(math_64.compare(k, BIG_NUMBER_CONSTANTS.MINUS_ONE)) >= 0)) {
      return { invalidBigNumber: true };
    }

    return null;
  }

  bigNumberValidatorConstrained(
    control: AbstractControl
  ): ValidationErrors | null {
    const bigNumberRegex = /^-?\d+(\.\d+)?([eE]-?\d+)?$/;
    if (control.value && !bigNumberRegex.test(control.value)) {
      return { invalidBigNumber: true };
    }

    let k = math_64.bignumber(control.value);
    if (
      !(
        Number(math_64.compare(k, BIG_NUMBER_CONSTANTS.MINUS_ONE)) >= 0 &&
        Number(math_64.compare(k, BIG_NUMBER_CONSTANTS.ONE)) <= 0
      )
    ) {
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

  showCalculator(inputType: InputType) {
    this.whereToUseCalculatedValue =
      this.whereToUseCalculatedValue === inputType ? null : inputType;
    this.shouldShowCalculator = this.whereToUseCalculatedValue !== null;
    console.log(this.whereToUseCalculatedValue);
    console.log(this.shouldShowCalculator);

    this.currentCalculatedValue = '';
  }

  onCalculated(value: string): void {
    this.currentCalculatedValue = value;
  }

  useCalculatedValue(): void {
    let controlName: string;
    switch (this.whereToUseCalculatedValue) {
      case InputType.PRECISION: {
        controlName = 'precisionValue';
        break;
      }
      case InputType.ORDER: {
        controlName = 'orderValue';
        break;
      }
      case InputType.ALPHA: {
        controlName = 'aParameterValue';
        break;
      }
      case InputType.BETA: {
        controlName = 'bParameterValue';
        break;
      }
      case InputType.VARIABLE:
      default: {
        controlName = 'variableValue';
      }
    }

    const control = this.form.get(controlName);
    const newValue = this.currentCalculatedValue;

    this.form.patchValue({
      [controlName]: newValue,
    });

    /* Trigger validation on the control */
    control?.updateValueAndValidity();

    /** Validate calculated value with appropriate form
     * if invalid show error
     */
    if (control?.invalid && control?.touched) {
      const errors = control?.errors;
      console.error('Validation error:', errors);
    }
  }

  useCalcValDisabled(): boolean {
    if (this.currentCalculatedValue.length < 1) return true;
    if (this.whereToUseCalculatedValue) return false;

    const precisionNumberRegex =
      /^(0(\.\d+)?|0\.\d+|([0-9]\d*(\.\d+)?(e-?\d+)?))$/i;

    return !precisionNumberRegex.test(this.currentCalculatedValue);
  }

  createForm() {
    switch (this.parameter) {
      case FunctionType.BESSEL_FIRST_KIND:
      case FunctionType.BESSEL_SECOND_KIND:
      case FunctionType.BESSEL_THIRD_KIND:
        this.form = this.formBuilder.group({
          orderValue: ['0', [Validators.required, this.bigNumberValidator]],
          precisionValue: [
            '1e-64',
            [Validators.required, this.bigNumberValidatorForPrecision],
          ],
          variableValue: ['0', [Validators.required, this.bigNumberValidator]],
        });
        break;
      case FunctionType.LAGUERRE_POLYNOMIAL:
        this.form = this.formBuilder.group({
          orderValue: [
            '1',
            [Validators.required, this.bigNumberValidatorNatural],
          ],
          variableValue: ['0', [Validators.required, this.bigNumberValidator]],
        });
        break;
      case FunctionType.LEGENDRE_POLYNOMIAL:
      case FunctionType.CHEBYSHEV_FIRST_KIND:
      case FunctionType.CHEBYSHEV_SECOND_KIND:
        this.form = this.formBuilder.group({
          orderValue: [
            '0',
            [Validators.required, this.bigNumberValidatorNatural],
          ],
          variableValue: [
            '0',
            [Validators.required, this.bigNumberValidatorConstrained],
          ],
        });
        break;
      case FunctionType.JACOBI_POLYNOMIAL:
        this.form = this.formBuilder.group({
          orderValue: [
            '1',
            [Validators.required, this.bigNumberValidatorNatural],
          ],
          variableValue: [
            '0',
            [Validators.required, this.bigNumberValidatorN0],
          ],
          aParameterValue: [
            '0',
            [Validators.required, this.bigNumberValidatorForParams],
          ],
          bParameterValue: [
            '0',
            [Validators.required, this.bigNumberValidatorForParams],
          ],
        });
        break;
      default:
        this.form = this.formBuilder.group({
          orderValue: ['', [Validators.required, this.bigNumberValidator]],
          precisionValue: [
            '1e-64',
            [Validators.required, this.bigNumberValidatorForPrecision],
          ],
          variableValue: ['0', [Validators.required, this.bigNumberValidator]],
        });
        break;
    }
  }

  loadTranslations() {
    const selectedLanguage = this.languageService.getSelectedLanguage();
    this.http
      .get(`./assets/i18n/${selectedLanguage}.json`)
      .subscribe((translations: any) => {
        this.labelOrderNatural = translations.input.labelOrderNatural;
        this.labelOrderReal = translations.input.labelOrderReal;
        this.labelPrecision = translations.input.labelPrecision;
        this.labelVariable = translations.input.labelVariable;
        this.labelVariableConstrained =
          translations.input.labelVariableConstrained;
        this.labelVariableN0 = translations.input.labelVariableN0;
        this.errorMessage = translations.input.errorMessage;
        this.aInputLabel = translations.input.aInputLabel;
        this.bInputLabel = translations.input.bInputLabel;

        this.basicInformationsLabel =
          translations.input.buttonBasicInformations;
        this.useCalculatedValueLabel =
          translations.input.buttonUseCalculatedValue;
        this.calculateAndDrawLabel =
          translations.input.buttonCalculateAndDrawGraph;

        this.loadInputTranslations();
      });
  }

  loadInputTranslations() {
    this.orderInputReal.label = this.labelOrderReal;
    this.orderInputReal.error = this.errorMessage;

    this.orderInputNatural.label = this.labelOrderNatural;
    this.orderInputNatural.error = this.errorMessage;

    this.precisionInput.label = this.labelPrecision;
    this.precisionInput.error = this.errorMessage;

    this.variableInput.label = this.labelVariable;
    this.variableInput.error = this.errorMessage;

    this.aInput.label = this.aInputLabel;
    this.aInput.error = this.errorMessage;

    this.bInput.label = this.bInputLabel;
    this.bInput.error = this.errorMessage;

    this.variableInputConstrained.label = this.labelVariableConstrained;
    this.variableInputConstrained.error = this.errorMessage;

    this.variableInputN0.label = this.labelVariableN0;
    this.variableInputN0.error = this.errorMessage;
  }

  assignInput() {
    switch (this.parameter) {
      case FunctionType.BESSEL_FIRST_KIND:
      case FunctionType.BESSEL_SECOND_KIND:
      case FunctionType.BESSEL_THIRD_KIND:
        this.inputs = [
          this.orderInputReal,
          this.precisionInput,
          this.variableInput,
        ];
        break;
      case FunctionType.LAGUERRE_POLYNOMIAL:
        this.inputs = [this.orderInputNatural, this.variableInput];
        break;
      case FunctionType.LEGENDRE_POLYNOMIAL:
      case FunctionType.CHEBYSHEV_FIRST_KIND:
      case FunctionType.CHEBYSHEV_SECOND_KIND:
        this.inputs = [this.orderInputNatural, this.variableInputConstrained];
        break;
      case FunctionType.JACOBI_POLYNOMIAL:
        this.inputs = [
          this.orderInputNatural,
          this.variableInputN0,
          this.aInput,
          this.bInput,
        ];
        break;
      default:
        this.inputs = [
          this.orderInputReal,
          this.precisionInput,
          this.variableInput,
        ];
        break;
    }
  }

  openNewWindow() {
    window.open(`/function-informations/${this.parameter}`, '_blank');
  }
}

interface IInput {
  label: string;
  formControlName: string;
  isInvalid: string;
  error: string;
  inputType: InputType;
}
