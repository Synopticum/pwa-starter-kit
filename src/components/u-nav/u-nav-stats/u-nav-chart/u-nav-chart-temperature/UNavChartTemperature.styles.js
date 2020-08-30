import {css} from 'lit-element/lit-element';

export default css`
.chart {
    width: 490px;
    height: 490px;
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

/* circles */
.group-circle {

}

.group-circle__point {
    cursor: pointer;
    transition: transform .3s, fill .3s;
}

.group-circle__value {
    visibility: hidden;
    font-size: 14px;
}

.group-circle__background {
    visibility: hidden;
    fill: #fff;
}

.group-circle:hover .group-circle__value,
.group-circle:hover .group-circle__background {
    visibility: visible;
}
`;