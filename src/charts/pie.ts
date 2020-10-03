import { PieArcDatum } from 'd3';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { arc, pie } from 'd3-shape';

export function generatePieChart (data: number[], ref: HTMLElement) {
  const height = 300;
  const width = 300;
  const radius = (width / 2);

  while (ref.lastElementChild) {
    ref.removeChild(ref.lastElementChild);
  }

  const pies = pie<number>().sort(null).value((d: number): number => d);
  const arcs = arc<PieArcDatum<number>>().innerRadius(radius - 60).outerRadius(radius - 30);

  const svg = select(ref)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const group = svg
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  group.selectAll('path')
        .data(pies(data))
        .join('path')
        .attr('fill', (_, i) => schemeCategory10[i])
        .attr("d", arcs);
}