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
    border: 2px solid rgba(111,155,52,1);
    min-width: 500px;
    min-height: 500px;
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
    opacity: 1;
    transition: opacity .3s;
}

.image-overlay::before {
    content: '';
    position:absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
    background: linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%);
    transition: opacity .3s;
}

.image-overlay--active::before {
  opacity: 1;
}

.icon-button {
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    outline: 0;
    border: none;
    vertical-align: baseline;
    background: #e0e1e2 none;
    color: rgba(0,0,0,.6);
    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
    padding: 18px 20px;
    text-transform: none;
    text-shadow: none;
    font-weight: 700;
    line-height: 1em;
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: .28571429rem;
    box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset, 0 1px 2px rgba(0,0,0,.3);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-transition: opacity .1s ease,background-color .1s ease,color .1s ease,background .1s ease,-webkit-box-shadow .1s ease;
    transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease,-webkit-box-shadow .1s ease;
    -webkit-tap-highlight-color: transparent;
    background-repeat: no-repeat;
    background-position: 50% 50%;
}

.icon-button:hover {
    background-color: #cacbcd;
    box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset, 0 1px 2px rgba(0,0,0,.3);
    color: rgba(0,0,0,.8);
}

.icon-button:active {
    background-color: #babbbc;
    color: rgba(0,0,0,.9);
    box-shadow: 0 0 0 1px transparent inset;
}

.icon-button:focus {
    background-color: #cacbcd;
    color: rgba(0,0,0,.8);
}

.icon-button--comments {
  margin-left: 2px;
  background-image: url('static/images/dot/comments.svg');
  background-size: 20px;
}

.icon-button--close {
  margin-left: 2px;
  background-image: url('static/images/dot/close.svg');
  background-size: 16px;
}

.icon-button--controls {
  background-image: url('static/images/dot/controls.svg');
  background-size: 16px;
}

.icon-button--hide-sidebar {
  margin-right: 255px;
  background-image: url('static/images/dot/close.svg');
  background-size: 16px;
}
`;