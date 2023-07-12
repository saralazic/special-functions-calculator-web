import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  templateUrl: 'svg-icon.component.html',
})
export class SvgIconComponent {
  @Input() iconName?: string;
  @Input() size = 71; // Default size is 24 pixels

  get iconPath(): string {
    return `assets/icons/${this.iconName}.svg`; // Adjust the file path if necessary
  }
}
