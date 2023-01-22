import {
    Component,
    Input,
    Output,
    EventEmitter,
    TemplateRef,
  } from '@angular/core';
  import { MonthViewDay, CalendarEvent } from 'calendar-utils';
  import { PlacementArray } from 'positioning';
  
  @Component({
    selector: 'mwly-calendar-month-cell',
    template: `
      <ng-template
        #defaultTemplate
        
        let-day="day"
        let-openDay="openDay"
        let-locale="locale"
        let-tooltipPlacement="tooltipPlacement"
        let-highlightDay="highlightDay"
        let-unhighlightDay="unhighlightDay"
        let-eventClicked="eventClicked"
        let-tooltipTemplate="tooltipTemplate"
        let-tooltipAppendToBody="tooltipAppendToBody"
        let-tooltipDelay="tooltipDelay"
        let-trackByEventId="trackByEventId"
        let-validateDrag="validateDrag"
      >
        <div
          class="cal-cell-top"
          [attr.aria-label]="
            { day: day, locale: locale } 
          "
        >
          <span aria-hidden="true">
            <span class="cal-day-badge" >{{
                day
            }}</span>
            <span class="cal-day-number">{{
              day
            }}</span>
          </span>
        </div>
      </ng-template>
      <ng-template
        [ngTemplateOutlet]="customTemplate || defaultTemplate"
        [ngTemplateOutletContext]="{
          day: day,
          openDay: openDay,
          locale: locale,
          tooltipPlacement: tooltipPlacement,
          highlightDay: highlightDay,
          unhighlightDay: unhighlightDay,
          eventClicked: eventClicked,
          tooltipTemplate: tooltipTemplate,
          tooltipAppendToBody: tooltipAppendToBody,
          tooltipDelay: tooltipDelay,
          trackByEventId: '',
          validateDrag: ''
        }"
      >
      </ng-template>
    `,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
   
  })
  export class CalendarMonthCellyComponent {
    @Input() day: MonthViewDay | any;
  
    @Input() openDay: MonthViewDay | any;
  
    @Input() locale: string | any;
  
    @Input() tooltipPlacement: PlacementArray | any;
  
    @Input() tooltipAppendToBody: boolean | any;
  
    @Input() customTemplate: TemplateRef<any> | any;
  
    @Input() tooltipTemplate: TemplateRef<any> | any;
  
    @Input() tooltipDelay: number | null | any;

    @Input() totalAmount: number | any
  
    @Output() highlightDay: EventEmitter<any> = new EventEmitter();
  
    @Output() unhighlightDay: EventEmitter<any> = new EventEmitter();
  
    @Output() eventClicked = new EventEmitter<{
      event: CalendarEvent;
      sourceEvent: MouseEvent;
    }>();
  
  }