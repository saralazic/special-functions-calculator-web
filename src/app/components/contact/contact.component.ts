import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language-service/language.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  private subscription?: Subscription;
  contactForm!: FormGroup; // Add "!" to indicate it will be initialized in ngOnInit

  phoneIconPath = 'assets/icons/phone.svg';
  emailIconPath = 'assets/icons/email.svg';

  name?: string;
  message?: string;
  email?: string;
  submit?: string;
  contactUs?: string;
  response?: string;

  showResponse?: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadTranslations();
    this.showResponse = false;
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
        this.name = translations.contact.name;
        this.email = translations.contact.email;
        this.message = translations.contact.message;
        this.contactUs = translations.contact.title;
        this.submit = translations.contact.button;
        this.response = translations.contact.success;
      });
  }

  initForm() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.contactForm && this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log(formData);

      this.showResponse = true;

      // You can perform further actions like sending the form data to a server
      // or displaying a success message here.
    }
  }
}
