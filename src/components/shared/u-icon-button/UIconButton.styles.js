import {css} from 'lit-element/lit-element';

export default css`
:host {
  display: inline-flex;
}

:host([hidden]) {
    display: none;
}

.icon-button {
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    outline: 0;
    border: none;
    vertical-align: baseline;
    background: #e0e1e2 no-repeat 50% 50%;
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
    user-select: none;
    -webkit-transition: opacity .1s ease,background-color .1s ease,color .1s ease,background .1s ease,-webkit-box-shadow .1s ease;
    transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease,-webkit-box-shadow .1s ease;
    -webkit-tap-highlight-color: transparent;
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
    background-image: url('/static/images/dot/comments.svg');
    background-size: 20px;
}

.icon-button--close {
    margin-left: 2px;
    background-image: url('/static/images/dot/close.svg');
    background-size: 16px;
}

.icon-button--gear {
    background-image: url('/static/images/dot/gear.svg');
    background-size: 16px;
}

.icon-button--check {
    background-image: url('/static/images/dot/check.svg');
    background-size: 21px;
}

.icon-button--save {
    background-image: url('/static/images/shared/u-icon-button/save.svg');
    background-size: 21px;
}

.icon-button--regular {
    padding: 15px;
    background-size: 15px;
}
`;