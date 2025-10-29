import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  mobile = false;
  
  constructor() {
    if (window.screen.width < 1060) {
      this.mobile = true;
    }
  }

}
