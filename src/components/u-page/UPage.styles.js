import {css} from 'lit-element/lit-element';

export default css`
:host {
    --inner-border: 15px;
    position: absolute;
    left: 65px;
    top: 0;
    width: calc(100% - 50px - var(--inner-border)*2);
    height: calc(100% - 30px);
    z-index: 50;
    margin: 15px 15px 15px 0;
    box-sizing: border-box;
    background: transparent;
    border-radius: 10px;
    box-shadow: 0 0 0 10px #111;
    outline: var(--inner-border) solid #111;
}

:host([default]) {
    pointer-events: none;
}

.u-page {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
}

:host([hidden]) {
    display: none;
}
`;