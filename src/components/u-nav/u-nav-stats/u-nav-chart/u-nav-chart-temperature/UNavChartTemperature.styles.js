import {css} from 'lit-element/lit-element';

export default css`
:host {
    --fill-color: rgb(147, 55, 53);
}

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
    transition: fill .3s;
}

.group-circle__point:hover {
    fill: var(--fill-color);
}

.group-circle__value {
    opacity: 0;
    fill: #fff;
    font-size: 14px;
}

.group-circle__background {
    opacity: 0;
    fill: #fff;
    transition: opacity .2s;
}

.group-circle:hover .group-circle__value,
.group-circle:hover .group-circle__background {
    opacity: 1;
}

.group-circle:hover .group-circle__background {
    fill: var(--fill-color);
}
`;