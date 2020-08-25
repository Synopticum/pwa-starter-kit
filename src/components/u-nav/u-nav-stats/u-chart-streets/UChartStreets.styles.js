import {css} from 'lit-element/lit-element';

export default css`
:host {

}

:host([hidden]) {
    display: none;
}

.chart {
    position: relative;
}

.chart__title {
    position: relative;
    display: flex;
    align-items: center;
}

.chart__title-text {
    display: inline-flex;
    font-size: 11px;
    margin-bottom: 15px;
    text-transform: uppercase;
    background-color: #ffffff;
    color: #111;
    border-radius: 5px;
}

.chart__title-text-value {
    border-bottom: 1px dashed #ccc;
}

.chart__title-close {
    cursor: pointer;
    position: absolute;
    right: -10px;
    top: -1px;
    width: 15px;
    height: 15px;
    background: url('/static/images/components/u-nav/u-nav-stats/close.svg') no-repeat 50% 50% / 100%;
}

.chart__graphic {

}

rect.line {
    position: relative;
    height: 12px;
    /*fill: #111;*/
    stroke: #fff;
    stroke-width: 2px;
}

rect.line:hover {
    opacity: .75;
}

text.label {
    font-size: 10px;
    fill: #ffffff;
}
`;