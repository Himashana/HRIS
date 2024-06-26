import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarView, CalendarEventTimesChangedEvent, CalendarEventAction} from 'angular-calendar';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from "date-fns";
import {EventService} from "../../../services/event.service";
import {EventDialogComponent} from "../../dialogs/event-dialog/event-dialog.component";
import { EventColor } from 'calendar-utils';
import {EventAddComponent} from "../../dialogs/event-add/event-add.component";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss']
})
export class EventCalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollable') scrollable!: ElementRef | any;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  colors: Record<string, EventColor> = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  };
  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: { ...this.colors['red'] },
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: { ...this.colors['yellow'] },
    //   actions: this.actions,
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: { ...this.colors['blue'] },
    //   allDay: true,
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: addHours(new Date(), 2),
    //   title: 'A draggable and resizable event',
    //   color: { ...this.colors['yellow'] },
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   },
    //   draggable: true,
    // },
  ];
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();

  userId: any;

  constructor(private eventService: EventService,
              public dialog: MatDialog,
              public renderer: Renderer2,
              private cookieService: AuthService) {}

  ngOnInit() {
    this.userId = this.cookieService.userID().toString();
    this.fetchEvents();
  }

  ngAfterViewInit() {
    this.addPassiveEventListener()
  }

  fetchEvents() {
    this.eventService.getEvents().subscribe(data => {
      this.events = data.map((event: any) => {
        let uid = event.meta.userId ? event.meta.userId : '000000000000000000000000';
        return {
          meta: event.meta?event.meta:{},
          title: event.title,
          start: new Date(event.start),
          end: event.end ? new Date(event.end) : null,
          color: event.color,
          draggable: event.draggable,
          resizable: {
            beforeStart: event.beforeStart,
            afterEnd: event.afterEnd
          },
          actions: uid === this.userId && event.actions?this.actions:null,
          allDay: event.allDay,
          cssClass: 'calendar-event'
        };
      });
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
        this.openCreateDialog(date)
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: { event, action }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchEvents();
    });
  }

  openCreateDialog(date: any) {

    const dialogRef = this.dialog.open(EventAddComponent, {
      maxHeight: '90vh',
      data: {
        title: 'Add Event',
        event: null,
        userId: this.userId,
        startDate: date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchEvents();
    });
  }

  addPassiveEventListener() {
    this.scrollable.nativeElement.addEventListener('touchstart', this.handleTouchStart, { passive: true });
  }

  handleTouchStart(event: TouchEvent) {
    //TODO: add touch support
  }
}
