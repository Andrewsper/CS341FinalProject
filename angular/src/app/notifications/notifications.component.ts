import { Component } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {


  constructor(private notificationService: NotificationService) { }

  notifications: string[] = [];

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(
      (notifications: string[]) => {
        this.notifications = notifications;
      }
    );
  }

}
