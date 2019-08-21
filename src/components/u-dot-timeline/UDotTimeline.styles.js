import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
}

.decade {
    cursor: pointer;
    padding: 5px 10px;
    background-color: rgba(255,255,255,.9);
    color: #000000;
    border-radius: 20px;
    opacity: .5;
    margin: 5px 10px;
    transition: background-color .2s;
}

.decade--active {
    opacity: 1;
}

.decade--active:hover {
    background-color: #eeeeee;
}
`;