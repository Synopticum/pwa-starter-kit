import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: absolute;
    left: 0;
    top: 0;
    width: 65px;
    height: 100%;
    z-index: 100;
    background: #111;
}

.u-nav {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0 15px 0;
    height: 100%;
}

:host([hidden]) {
    display: none;
}

.buttons {
    justify-content: center;
    padding-top: 20px;
}
`;