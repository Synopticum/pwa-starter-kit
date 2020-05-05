import {css} from 'lit-element/lit-element';

export default css`
.u-text-button {
  display: inline-flex;
}

.button {
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    outline: 0;
    border: none;
    vertical-align: baseline;
    background: #e0e1e2 none;
    color: rgba(0,0,0,.6);
    font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
    font-size: 12px;
    padding: .78571429em 1.5em .78571429em;
    text-transform: none;
    text-shadow: none;
    font-weight: 700;
    line-height: 1em;
    font-style: normal;
    text-align: center;
    text-decoration: none;
    border-radius: .28571429rem;
    box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset;
    -webkit-user-select: none;
    user-select: none;
    transition: opacity .1s ease,background-color .1s ease,color .1s ease,box-shadow .1s ease,background .1s ease,-webkit-box-shadow .1s ease;
    -webkit-tap-highlight-color: transparent;
}

.button:hover {
    background-color: #cacbcd;
    background-image: none;
    box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset;
    color: rgba(0,0,0,.8);
}

.button:active {
    background-color: #babbbc;
    color: rgba(0,0,0,.9);
    box-shadow: 0 0 0 1px transparent inset;
}

.button:disabled {
    cursor: default;
    opacity: .5;
}
`;