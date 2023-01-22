import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DemoUtilsModule } from '../demo-utils/module';
import { DemoComponent } from './component';

import { CalendarModule, CalendarMonthModule } from 'angular-calendar';
import { CalendarMonthCellyComponent } from './calmonthcellcomp';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    CalendarModule,
    DemoUtilsModule,
    RouterModule.forChild([{ path: '', component: DemoComponent }]),
    CalendarMonthModule
  ],
  declarations: [DemoComponent, CalendarMonthCellyComponent],
  exports: [DemoComponent],
})
export class CalModule {}