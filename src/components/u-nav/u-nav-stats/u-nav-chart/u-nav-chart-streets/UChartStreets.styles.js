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
    height: 10px;
    font-size: 10px;
    color: #ffffff;
    width: 100%;
    border-radius: 2px;
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