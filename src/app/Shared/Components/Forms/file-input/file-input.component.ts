import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent  implements OnInit {

  constructor() { }
  @Input() fileName: string = ''
  @Input() fileIcon: string = ''
  @Input() disabled: boolean = false
  @Input() updateFile: boolean = false

  ngOnInit() {}

}
