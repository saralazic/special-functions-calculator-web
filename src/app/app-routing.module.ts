import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { FunctionInputComponent } from './components/function-input/function-input.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SpecialFunctionComponent } from './components/special-function/special-function.component';

const routes: Routes = [
  { path: '', redirectTo: '/homepage', pathMatch: 'full' },
  { path: 'special-function/:parameter', component: SpecialFunctionComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },

  // todo: DELETE
  { path: 'input', component: FunctionInputComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
