import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(public matDialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
  }

  start(): void {
    this.router.navigate(['/start']);
  }
}
