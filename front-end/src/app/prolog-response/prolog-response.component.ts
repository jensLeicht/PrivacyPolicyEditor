import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prolog-response',
  templateUrl: './prolog-response.component.html',
  styleUrls: ['./prolog-response.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '100px',
        opacity: 1,
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
      })),
      transition('open => closed', animate('0.2s')),
      transition('closed => open', animate('0.2s'))
    ])
  ]
})
export class PrologResponseComponent implements OnInit {

  list = "Text";

  constructor(public dialogRef: MatDialogRef<PrologResponseComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.list = data;
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
