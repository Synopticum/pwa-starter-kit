import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 200;
    width: 400px;
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    background-color: rgba(255,255,255,.95);
    border-left: 2px solid rgba(111,155,52,.95);
}

:host([hidden]) {
    display: none;
}

.u-comments {
    height: 100%;
}

.title {
    font-size: 24px;
}

.loading {
    display: block;
    margin: 10px 0;
}

.no-comments {
    margin: 10px 0;
    padding: 10px;
    border: 1px dashed #eee;
    font-size: 14px;
}

.comments {
    height: calc(100% - 140px);
    overflow-y: auto;
    margin-bottom: 15px;
    padding-right: 10px;
}

.form {
    display: flex;
    flex-direction: column;
}

.textarea {
    margin-bottom: 10px;
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
    -moz-user-select: none;
    -ms-user-select: none;
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

.button:focus {
    background-color: #cacbcd;
    color: rgba(0,0,0,.8);
}

.button--add-comment {
    align-self: flex-end;
}

@media only screen and (max-width: 992px)  {
  :host {
    width: 100%;
    overflow-y: auto;
  }
}
`;