import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-save-message',
  templateUrl: './save-message.component.html',
  styleUrls: ['./save-message.component.scss']
})
export class SaveMessageComponent implements OnInit {

  infoText: string[];

  constructor(public dialogRef: MatDialogRef<SaveMessageComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.infoText = data;
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
