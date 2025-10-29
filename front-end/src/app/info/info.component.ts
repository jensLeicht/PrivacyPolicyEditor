import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  title!: string;
  infoText: string[];

  constructor(public dialogRef: MatDialogRef<InfoComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.infoText = data.infoText;
    this.title = data.title;
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }
}
