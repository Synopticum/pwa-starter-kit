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
    background-color: #fff;
    transition: background-color .3s;
    margin-bottom: 10px;
}

.chart__title-text {
    font-size: 17px;
}

.chart__title-back {
    cursor: pointer;
    position: absolute;
    border-radius: 0 10px 10px 0;
    right: -40px;
    top: -15px;
    width: 40px;
    height: 30px;
    background: url('/static/images/components/u-nav/u-nav-stats/close.svg') no-repeat calc(50% + 3px) 50% / 15px;
    background-color: #fff;
}

.chart__graphic {

}
`;
