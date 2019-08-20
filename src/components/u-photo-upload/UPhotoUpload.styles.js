import {css} from 'lit-element/lit-element';
export default css`
:host {
    display: flex;
}

.u-photo-upload {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* input file */
.select-image {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  color: transparent;
  outline: 0;
  width: 143px;
  height: 36px;
  border-radius: 0 15px 15px 0;
  background: linear-gradient(#ffffff, #cccccc);
  background-size: 15px;
  box-shadow: 2px 2px 2px rgba(0,0,0,.5);
}
:host(:only-child) .select-image {
    border-radius: 15px;
}
.select-image::before {
    content: 'Добавить фото';
    position: absolute;
    top: 7px;
    left: 15px;
    font-family: 'PT Serif', 'Times New Roman', serif;
    color: #000000;
    font-size: 16px;
}
.select-image:active {
  background: linear-gradient(#cccccc, #ffffff);
}
.select-image::-webkit-file-upload-button {
  visibility: hidden;
}

.select-image:disabled {
    cursor: not-allowed;
    opacity: .3;
}

/* select */
.select-decade {
    display: none;
    font-family: 'PT Serif', 'Times New Roman', serif;
    font-size: 16px;
    color: #000;
    line-height: 1.3;
    padding: 8px 35px 8px 15px;
    width: 100%;
    max-width: 100%; 
    box-sizing: border-box;
    margin: 0 0 0 15px;
    border: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: url('static/images/button-icons/select.svg') no-repeat calc(100% - 10px) 50%, linear-gradient(#ffffff, #cccccc);
    background-size: 15px;
    outline: none;
    border-radius: 15px;
}

.select-decade::-ms-expand {
    display: none;
}

.select-decade option {
    font-weight:normal;
}

.select-decade--active {
    display: inline-flex;
}

/* upload button */
.upload {
    display: none;
    margin-left: 15px;
    --border-radius: 15px;
}

.upload--active {
    display: inline-flex;
}
`;