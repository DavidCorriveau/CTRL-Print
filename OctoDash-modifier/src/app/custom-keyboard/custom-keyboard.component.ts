/*
*@file custom-keyboard.component.ts
*@author David Corriveau
*@date Avril 2023
*@brief Classe qui crée un clavier graphiquement pour écrire ou effacer des chiffres. Lorsque qu'un bouton est appuyé, la classe emet un événement
* appelé "buttonClick". Cette événement peut appelé une autre méthode en passant en paramètre son argument value.
*/
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
