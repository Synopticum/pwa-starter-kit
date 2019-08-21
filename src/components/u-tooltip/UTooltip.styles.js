import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed;
    width: 100px;
    height: 100px;
    z-index: 200;
    border: 3px solid #6E9A32;
    border-radius: 5px;
    transform: scale(1);
    transition: transform .3s;
    background-size: cover;
}

:host([hidden]) {
    display: block !important;
    transform: scale(0);
}

:host::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: .3;
    background: linear-gradient(transparent,#000);
}
`;