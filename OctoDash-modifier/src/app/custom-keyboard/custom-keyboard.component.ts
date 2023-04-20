import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-keyboard',
  templateUrl: './custom-keyboard.component.html',
  styleUrls: ['./custom-keyboard.component.scss']
})
export class CustomKeyboardComponent {
  @Output() buttonClick = new EventEmitter<string>();

  changeValue(value:string) {
    this.buttonClick.emit(value);
  }
}
