
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-modal-token',
  templateUrl: './modal-token.component.html',
  styleUrls: ['./modal-token.component.scss']
})
export class ModalTokenComponent implements OnInit{

url=''
  constructor(public dialogRef: MatDialogRef<ModalTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,){ }
  ngOnInit(): void {
      this.url=this.data['link']
  }
  copiarLink(){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.dialogRef.close()
  }
}
