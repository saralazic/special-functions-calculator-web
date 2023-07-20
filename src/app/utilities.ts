// import * as Plotly from 'plotly.js';
//import { Data, Layout } from 'plotly.js';

export function factorial(n: number): number {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

export function drawGraph(element: HTMLElement, x: number[], y: number[]) {
  // const data: Data[] = [
  //   {
  //     x: x,
  //     y: y,
  //     mode: 'markers',
  //     type: 'scatter',
  //   },
  // ];
  // const layout: Partial<Layout> = {
  //   title: 'Graph',
  //   xaxis: { title: 'X-axis' },
  //   yaxis: { title: 'Y-axis' },
  // };
  //  Plotly.newPlot(element, data, layout);
}
