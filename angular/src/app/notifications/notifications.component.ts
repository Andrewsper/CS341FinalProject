/**
 * This module contains the functionality of the notification component

Author: Will, Andrew

Date Modified: 2023-04-25
 */


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

  //initilizes the component
  ngOnInit() {
    this.notificationService.getNotifications().subscribe(
      (notifications: string[]) => {
        this.notifications = notifications;
      }
    );
  }

}
