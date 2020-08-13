import {css} from 'lit-element/lit-element';

export default css`
* { box-sizing: border-box }  
          
:host {
    display: inline-block;
}

:host([hidden]) {
    display: none;
}

.textbox__element {
    width: 100%;
    padding: 0 10px;
    height: 32px;
    font-family: inherit;
    font-size: var(--font-size, 14px);
    font-style: var(--font-style, none);
    color: #000;
    outline: none;
    transition: border-color, background-color .3s;
    border: 1px dashed #ccc;
    background-color: #f9f9f9;
}

.textbox__element:hover {
    // border-color: rgba(255,255,255,.5);
}

.textbox__element:focus {
    border-color: #999;
    border-style: dashed;
    background-color: #fff;
}

.textbox__element::selection {
    background-color: rgb(111, 155, 52);
    color: #ffffff;
}

.textbox__element::-webkit-input-placeholder {
    font-style: italic;
}

.textbox__element::-moz-placeholder {
    font-style: italic;
}

.textbox.textbox--is-updating .textbox__element {
    background-image: repeating-linear-gradient(
        -45deg,
        #eaeaea,
        #eaeaea 11px,
        #fff 10px,
        #fff 20px
    );
    background-size: 28px 28px;
    animation: move .5s linear infinite;
}

@keyframes move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 28px 0;
    }
}

.textbox__element.textbox__element--default {

}
`;