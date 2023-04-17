import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "./user.service";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    notificationRoute = 'http://127.0.0.1:9090/notifications/';

    constructor(private http: HttpClient,
        private userService: UserService) { }

    getNotifications(): Observable<string[]> {
        return this.http.get<string[]>(this.notificationRoute + this.userService.curUser.userid);
    }


}