import {css} from 'lit-element/lit-element';

export default css`
:host {
    z-index: 200;
    pointer-events: all;
    transform: scale(1);
    transition: transform .3s;
    border-radius: 3px;
    background-color: #111;
    box-shadow: 4px 4px 4px rgba(0,0,0,.15);
}

:host([hidden]) {
    display: none;
}

:host([hidden]) {
    display: block !important;
    transform: scale(0);
    width: 0;
    height: 0;
}

.u-dot {
    
}

.nav {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 175;
}

.wrapper {
    width: 100%;
    height: 100%;
    font-size: 0;
}

.form {
    position: relative;
    z-index: 150;
    padding: 15px 20px;
    background-color: rgba(0,0,0,.75);
}

.hide-comments {
    cursor: pointer;
    position: absolute;
    left: -37px;
    top: 50%;
    width: 30px;
    height: 40px;
    background: url('static/images/button-icons/hide-comments.svg') no-repeat 50% 50% rgba(255,255,255,.95);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image {
    width: 100%;
    height: 100%;
    max-width: 95vw;
    max-height: 95vh;
    object-fit: contain;
}
`;