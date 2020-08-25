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
    padding: 10px 0;
    text-align: center;
    background-color: #eeeeee;
    border-bottom: 2px solid #fff;
    transition: background-color .3s;
    margin-bottom: 10px;
}

.chart__title:hover {
    cursor: pointer;
    background-color: #dddddd;
}

.chart__title-text {
    font-size: 18px;
}

.chart__title-back {
    cursor: pointer;
    position: absolute;
    right: -10px;
    top: 10px;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    background: url('/static/images/components/u-nav/u-nav-stats/back.svg') no-repeat 50% 50% / 15px;
    background-color: #fff;
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