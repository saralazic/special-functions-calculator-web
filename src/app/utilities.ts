import * as Plotly from 'plotly.js-basic-dist';

export function factorial(n: number): number {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

export function drawGraph(
  element: HTMLElement,
  xValues: number[],
  yValues: number[]
) {
  const trace: Partial<Plotly.ScatterData> = {
    x: xValues,
    y: yValues,
    type: 'scatter', // Change the type according to the plot you want (e.g., 'scatter', 'bar', etc.)
    mode: 'lines+markers', // Change the mode according to your preference
    marker: { size: 1 }, // Set the size property to adjust the marker size (you can change the value as needed)
  };

  const layout: Partial<Plotly.Layout> = {
    // Add any layout configuration you need here
  };

  const data = [trace];

  Plotly.newPlot(element, data, layout);
}
