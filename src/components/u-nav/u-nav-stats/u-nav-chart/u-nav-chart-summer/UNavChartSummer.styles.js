import {css} from 'lit-element/lit-element';

export default css`
.chart {
    width: 390px;
    height: 390px;
}

.domain {
    fill: none;
    stroke: transparent;
}

.tick:last-of-type {
    display: none;
}

.tick line {
    stroke: lightgray;
    shape-rendering: crispEdges;
}

path.line {
    fill: none;
    stroke: rgb(147, 55, 53);
    stroke-width: 2;
}
`;