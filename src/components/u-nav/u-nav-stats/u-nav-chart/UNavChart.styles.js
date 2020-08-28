import {css} from 'lit-element/lit-element';

export default css`
:host {
    height: 100%;
}

:host([hidden]) {
    display: none;
}

.chart {
    position: relative;
}

.chart__title {
    position: relative;
    padding: 0px 0;
    text-align: center;
    background-color: #fff;
    transition: background-color .3s;
    margin-bottom: 15px;
}

.chart__title-text {
    font-size: 20px;
}

.chart__title-back {
    cursor: pointer;
    position: absolute;
    border-radius: 0 10px 10px 0;
    top: -15px;
    right: -50px;
    height: 40px;
    width: 50px;
    background: url('/static/images/components/u-nav/u-nav-stats/close.svg') no-repeat calc(50% + 3px) 50% / 15px;
    background-color: #fff;
}

.chart__graphic {
    height: calc(100vh - 140px);
    overflow: hidden;
}
`;
