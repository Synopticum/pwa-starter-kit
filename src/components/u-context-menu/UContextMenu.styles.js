import {css} from 'lit-element/lit-element';
export default css`
:host {
    position: fixed;
    min-width: 150px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 2px 2px 3px rgba(0,0,0,.3);
    overflow: hidden;
    color: #000;
    z-index: 100;
    transform: scale(1);
    transition: transform .3s;
}

::slotted(.menu__item) {
    cursor: pointer;
    padding: 5px 25px 5px 15px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
}

::slotted(.menu__item:last-child) {
    border-bottom: 0;
}

::slotted(.menu__item:hover) {
    background-color: #eee;
}
`;