import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, ContentChild, ViewChild, ContentChildren, ViewChildren, AfterContentInit, Query, QueryList } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarMonthViewComponent, CalendarView, ɵCalendarMonthCellComponent } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import { Observable } from 'rxjs';
import { colors } from '../demo-utils/colors';
import { ToastrService } from 'ngx-toastr';
import { CalendarMonthCellComponent } from 'angular-calendar/modules/month/calendar-month-view/calendar-month-cell/calendar-month-cell.component';
// import { ToastrService } from 'ngx-toastr/public_api';

interface Txn {
  id: number,
  txnDate: string,
  txnType: string,
  comments: string,
  txnAmount: number
}

interface Film {
  id: number;
  title: string;
  release_date: string;
}

function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, '0');
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
  const direction = timezoneOffset > 0 ? '-' : '+';

  return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'template.html',
})
export class DemoComponent implements OnInit, AfterViewInit {
  view: CalendarView = CalendarView.Month;

  totalAmount:any = ''
  monthlyTotal:any = {}
  
  totalAxsFlexiAmount:any = ''
  monthlyAxsFlexiTotal:any = {}

  totalAxs90Amount:any = ''
  monthlyAxs90Total:any = {}
  viewDate: Date = new Date();

  events$: Observable<CalendarEvent<{ txn: Txn }>[]> = new Observable<CalendarEvent<{ txn: Txn }>[]>();

  activeDayIsOpen: boolean = false;

  @ViewChildren(ɵCalendarMonthCellComponent) monthView: QueryList<ɵCalendarMonthCellComponent> | undefined

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchEvents();
  }

  ngAfterViewInit(): void {
    console.log(this.monthView)
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    this.events$ = this.http
      .get<Txn[]>('http://localhost:8080/api/v1/txn')
      .pipe(
        map((results: Txn[]) => {
          let monthTag = ''+this.viewDate.getMonth()+'-'+this.viewDate.getFullYear()
          this.monthlyTotal[monthTag] = 0

          this.monthlyAxsFlexiTotal[monthTag] = 0
          this.monthlyAxs90Total[monthTag] = 0
          console.log(this.viewDate.getMonth())
          console.log(this.viewDate.getFullYear())
          return results.filter((tx:Txn) => new Date(tx.txnDate).getMonth() === this.viewDate.getMonth() 
            && new Date(tx.txnDate).getFullYear() === this.viewDate.getFullYear())
          .map((txn: Txn) => {
            console.log(new Date(txn.txnDate).getFullYear())
            //this.monthlyTotal['ac'] = txn.txnType === 'SAVEUSDT' ? txn.txnAmount : 0
            this.monthlyTotal[monthTag] += txn.txnType === 'SAVEUSDT' ? txn.txnAmount : 0
            this.monthlyAxsFlexiTotal[monthTag] += txn.txnType === 'AXSFLEXIEARN' ? txn.txnAmount : 0
            this.monthlyAxs90Total[monthTag] += txn.txnType === 'AXSSTAKE90' ? txn.txnAmount : 0
            return {
              title: `${txn.txnAmount.toFixed(8)}: ${new Date(txn.txnDate).toLocaleString()}`,
              //txnType: txn.txnType,
              start: new Date(
                new Date(txn.txnDate).toLocaleDateString() //+ getTimezoneOffsetString(this.viewDate)
              ),
              color: txn.txnType === 'SAVEUSDT' ? colors.green: (txn.txnType === 'AXSSTAKE90' ? colors.blue : colors.yellow),
              allDay: true,
              meta: {
                txn,
              },
            };
          });
        })
      );
      this.totalAmount = ''
      this.totalAxsFlexiAmount = ''
      this.totalAxs90Amount = ''
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent<{ txn: Txn }>[];
  }): void {

    let sum = events.reduce((accumulator, object) => {
      return accumulator + (object.meta?.txn.txnType === 'SAVEUSDT' ? (object.meta?.txn.txnAmount ?? 0) : 0)
    }, 0)
    
    this.totalAmount = sum

    sum = events.reduce((accumulator, object) => {
      return accumulator + (object.meta?.txn.txnType === 'AXSFLEXIEARN' ? (object.meta?.txn.txnAmount ?? 0) : 0)
    }, 0)

    
    this.totalAxsFlexiAmount = sum
    sum = events.reduce((accumulator, object) => {
      return accumulator + (object.meta?.txn.txnType === 'AXSSTAKE90' ? (object.meta?.txn.txnAmount ?? 0) : 0)
    }, 0)

    this.totalAxs90Amount = sum

    //this.toastr.success('' + sum, 'Day Total USDT Save Flexi Earn')

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ txn: Txn }>): void {
    // window.open(
    //   `https://www.themoviedb.org/movie/${event?.meta?.txn.id}`,
    //   '_blank'
    // );
  }
}