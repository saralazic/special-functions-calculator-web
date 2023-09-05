import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { SpecialFunctionComponent } from './components/special-function/special-function.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AboutComponent } from './components/about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/marginals/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './components/marginals/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './components/contact/contact.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { FunctionInputComponent } from './components/function-input/function-input.component';

@NgModule({
  declarations: [
    AppComponent,
    SvgIconComponent,
    SpecialFunctionComponent,
    HomepageComponent,
    AboutComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    CalculatorComponent,
    FunctionInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    MatIconModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
