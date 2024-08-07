import {ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { EventService } from '../../../services/event.service';
import { startOfDay, endOfDay, subDays, addDays, addHours, endOfMonth } from 'date-fns';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.scss']
})
export class EventAddComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | any;

  view: CalendarView = CalendarView.Month;
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
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  modalData: {
    action: string;
    event: CalendarEvent;
  } | any;
  isFound: boolean = false;
  isLoadingResults: boolean = false;

  receivedData: any;
  organizationId: any;

  constructor(private eventService: EventService,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              public cookieService: AuthService,
              public dialogRef: MatDialogRef<EventAddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.receivedData = this.data
    this.organizationId = this.cookieService.organization().toString()
    this.fetchEvents();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fetchEvents() {
    this.isLoadingResults = true
    this.isFound = false
    this.eventService.getEvents().subscribe(data => {
      this.isLoadingResults = false
      this.events = data.filter((event: any) => event.meta.organizationId === this.organizationId).map((event: any) => {
        let uid = event.meta.userId ? event.meta.userId : '000000000000000000000000';
        let orgId = event.meta.organizationId ? event.meta.organizationId : null;

        if (event.length > 0) {
          this.isFound = true
        }

        return {
          id: event.id,
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
          actions: uid === this.receivedData.userId && event.actions?this.actions:null,
          allDay: event.allDay
        };
      });
    });
  }

  addEvent(): void {
    const newEvent: CalendarEvent = {
      id: undefined,
      meta: {
        userId: this.receivedData.userId ? this.receivedData.userId:null,
        organizationId: this.receivedData.organizationId ? this.receivedData.organizationId:null,
      },
      title: 'New event',
      start: startOfDay(new Date(this.receivedData.startDate)),
      end: endOfDay(new Date()),
      color: { ...this.colors['red'] },
      draggable: true,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    };

    this.events = [...this.events, newEvent];
    this.refresh.next(undefined);
  }

  addToDB(event: CalendarEvent) {
    this.eventService.saveEvent(event).subscribe(savedEvent => {
      this.events = [...this.events, savedEvent];
      this.refresh.next(undefined);
      this.onNoClick();
      this.snackBar.open(`Event ${event.title} added!`, 'Close', {duration: 3000});
    }, error => {
      this.snackBar.open("Failed to create the event.", 'Close', {duration: 3000});
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);

    if(eventToDelete.id) {
      const id = eventToDelete.id.toString();
      this.eventService.deleteEvent(id).subscribe(() => {
        this.refresh.next(undefined);
        this.fetchEvents();
        this.snackBar.open(`Event ${eventToDelete.title} deleted!`, 'Close', {duration: 3000});
      }, error => {
        this.snackBar.open("Failed to delete the event.", 'Close', {duration: 3000});
      });
    }
  }

  updateEvent(event: CalendarEvent<any>) {
    this.eventService.updateEvent(event).subscribe(updatedEvent => {
      this.events = this.events.map((event) => {
        if (event.id === updatedEvent.id) {
          return updatedEvent;
        }
        return event;
      });
      this.refresh.next(undefined);
      this.fetchEvents();
      this.snackBar.open(`Event ${event.title} updated!`, 'Close', {duration: 3000});
    }, error => {
      this.snackBar.open("Failed to update the event.", 'Close', {duration: 3000});
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: { event, action }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.saveEvent(result).subscribe(() => {
          this.fetchEvents();
        });
      }
    });
  }
}
