import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warn-message',
  templateUrl: './warn-message.component.html',
  styleUrls: ['./warn-message.component.scss']
})
export class WarnMessageComponent implements OnInit {

  infoText: string[];

  constructor(public dialogRef: MatDialogRef<WarnMessageComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.infoText = data;
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
