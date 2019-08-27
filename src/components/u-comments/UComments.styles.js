import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 200;
    width: 300px;
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    background-color: rgba(255,255,255,.95);
}

:host([hidden]) {
    display: none;
}

.title {
    font-size: 24px;
}

.hide-comments {
    font-size: 16px;
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
  height: 75vh;
  overflow-y: auto;
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
    align-self: flex-end;
}
`;