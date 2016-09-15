import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: 'app/main.html'
})

export class AppComponent {
  results:any = [];
  num1:number;
  divider:number;
  length:number;
  input:string;
  numbers:number;


  ngOnInit() {
    console.log("--APP Started--");
    this.num1 = 37540;
    this.divider = 3;
  }

  pushMe() {
    var startCharPosition:any;
    var endCharPosition:any;
    var length:number;
    var tempNumber:any;
    var divider:number;
    var input:string;

    //this.results.clear;
    input = this.num1.valueOf().toString();
    divider = this.divider;

    length = input.length + 1;
    console.log("Length: " + length);
    console.log("Divider: " + divider);
    console.log("Input: " + input);

    console.log("--START--");

    for (startCharPosition = 0; startCharPosition < length; startCharPosition++) {
      for (endCharPosition = startCharPosition; endCharPosition < length; endCharPosition++) {
        if (startCharPosition != endCharPosition) {
          tempNumber = input.substr(startCharPosition, endCharPosition);
          if (parseInt(tempNumber) % divider === 0) {
            this.results[startCharPosition] = tempNumber;
            console.log(tempNumber);
          }
        }

      }
    }
    console.log("--END--");
  }
}
