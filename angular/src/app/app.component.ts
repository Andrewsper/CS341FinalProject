import { Component } from '@angular/core';
import { TestService } from './services/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  testString = "notChanged";

  constructor(private testService: TestService) {}

  getWord(): void {
    this.testService.getWord()
      .subscribe(testString => (this.testString = testString))
  }
}
