import {css} from 'lit-element/lit-element';

export default css`
.chart {
    width: 390px;
    height: 390px;
    background-color: #ffffff;
}

path.area {
    stroke: none;
    stroke-width: 2;
    opacity: .5;
}

path.line {
    fill: none;
    stroke: rgb(147, 55, 53);
    stroke-width: 2;
}
`;