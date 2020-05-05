import {css} from 'lit-element/lit-element';

export default css`
:host {
    pointer-events: none;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: var(--z-index);
    background-color: var(--background-color);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color .2s;
}

.noise {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: var(--noise-opacity);
}
`;