import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-special-function',
  templateUrl: './special-function.component.html',
  styleUrls: ['./special-function.component.css'],
})
export class SpecialFunctionComponent {
  parameter: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.parameter = this.route.snapshot.paramMap.get('parameter');
    // Use the 'parameter' value to fetch and display the corresponding data
  }
}
