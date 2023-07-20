import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BesselFirstKind } from 'src/app/models/bessel';
import { drawGraph } from 'src/app/utilities';

@Component({
  selector: 'app-special-function',
  templateUrl: './special-function.component.html',
  styleUrls: ['./special-function.component.css'],
})
export class SpecialFunctionComponent {
  @ViewChild('graphContainer') graphContainer!: ElementRef;

  private bessel?: BesselFirstKind;
  parameter: string | null = null;
  value?: number;

  constructor(private route: ActivatedRoute) {
    this.bessel = new BesselFirstKind();
  }

  ngOnInit(): void {
    this.bessel = new BesselFirstKind();
    this.parameter = this.route.snapshot.paramMap.get('parameter');
    // Use the 'parameter' value to fetch and display the corresponding data

    this.value = this.bessel?.calculate(1, 0.000001, 0.05);
  }

  drawGraph() {
    let x_arr = [],
      y_arr = [];
    for (let x = 0; x <= 10; x = x + 0.05) {
      let y = this.bessel?.calculate(2, 0.000001, x);
      x_arr.push(x);
      y_arr.push(y ?? 0);
    }
    drawGraph(this.graphContainer?.nativeElement, x_arr, y_arr);
  }
}
