import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BesselFirstKind } from 'src/app/models/bessel';
import { drawGraph } from 'src/app/utilities';

@Component({
  selector: 'app-special-function',
  templateUrl: './special-function.component.html',
  styleUrls: ['./special-function.component.css'],
})
export class SpecialFunctionComponent implements AfterViewInit {
  @ViewChild('graphContainer', { static: false }) graphContainer?: ElementRef;

  private bessel?: BesselFirstKind;
  parameter: string | null = null;
  value?: number;

  constructor(private route: ActivatedRoute) {
    this.bessel = new BesselFirstKind();
  }

  ngAfterViewInit() {
    const xValues = [1, 2, 3, 4, 5];
    const yValues = [2, 4, 1, 5, 3];

    drawGraph(this.graphContainer?.nativeElement, xValues, yValues);
  }

  ngOnInit(): void {
    this.parameter = this.route.snapshot.paramMap.get('parameter');
    // Use the 'parameter' value to fetch and display the corresponding data

    this.value = this.bessel?.calculate(1, 0.000001, 0.05);
  }
}
