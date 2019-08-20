import {css} from 'lit-element/lit-element';
export default css`
* { box-sizing: border-box }  
          
:host {
    display: inline-block;
}

.textbox__element {
    width: 100%;
    padding: 5px 10px;
    font-family: 'PT Serif', Helvetica, 'Times New Roman', serif;
    font-size: var(--font-size);
    font-style: var(--font-style);
    color: #fff;
    outline: none;
    transition: border-color .3s;
    background: none;
    border: 0 dashed rgba(255,255,255,.5);
}

.textbox__element:hover {
  border-color: rgba(255,255,255,.5);
}

.textbox__element:focus {
    border-color: #ccc;
    border-style: dashed;
}

.textbox__element::selection {
    background-color: var(--selection-color);
    color: #ffffff;
}

.textbox__element::-webkit-input-placeholder {
    font-style: italic;
}

.textbox__element::-moz-placeholder {
    font-style: italic;
}

.textbox.textbox--is-loading .textbox__element {
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