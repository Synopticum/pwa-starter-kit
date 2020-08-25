import {css} from 'lit-element/lit-element';

export default css`
:host {

}

:host([hidden]) {
    display: none;
}

.u-chart-streets {
    height: 100%;
}

.chart {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.chart__title {
    position: relative;
    padding: 10px 0;
    text-align: center;
    background-color: #fff;
    margin-bottom: 10px;
}

.chart__title-text {
    font-size: 17px;
}

.chart__title-back {
    cursor: pointer;
    position: absolute;
    border-radius: 10px;
    right: -50px;
    top: -15px;
    width: 30px;
    height: 30px;
    background: url('/static/images/components/u-nav/u-nav-stats/close.svg') no-repeat 50% 50% / 15px;
    background-color: #fff;
}

.chart__graphic {
    flex: 1;
    overflow: hidden;
}

.streets {

}

.street {
    position: relative;
    margin: 2px 0;
}

.street__label {
    z-index: 5;
    display: flex;
    align-items: center;
    padding: 0 0 1px 3px;
    height: 9px;
    font-size: 10px;
    color: #ffffff;
    width: 100%;
}

.street:hover .street__label {
    opacity: .75;
}

.street__name {
    display: none;
    z-index: 10;
    position: absolute;
    left: calc(100% + 8px);
    top: -8px;
    white-space: nowrap;
    background-color: #fafafa;
    border-radius: 3px;
    box-shadow: 1px 1px 3px rgba(0,0,0,.5);
    color: #111111;
    padding: 5px;
    font-size: 12px;
}

.street:hover .street__name {
    display: block;
}
`;