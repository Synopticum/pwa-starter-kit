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
    justify-content: center;
    align-items: flex-end;
    --underline-height: 5px;
    --transition-duration: .5s;
}

.u-dot-timeline {
    display: flex;
    flex-direction: row;
}

:host([hidden]) {
    display: none;
}

.decades {
    position: relative;
    font-size: 16px;
    white-space: nowrap;
    width: 200px;
    padding: 0;
    margin-bottom: 10px;
    background-color: rgb(224, 225, 226);
    border-radius: 7px;
    overflow: hidden;
    box-shadow: transparent 0 0 0 1px inset, 
                rgba(34, 36, 38, 0.15) 0 0 0 0 inset, 
                rgba(0, 0, 0, 0.3) 0 1px 2px;
}

.decades--only-child {
    width: 100px;
}

.decade {
    display: inline-block;
    z-index: 10;
    width: 50%;
    padding: 9px 0 10px 0;
    text-align: center;
    cursor: pointer;
    text-transform: uppercase;
    transition: box-shadow .3s ease-out;
}

.decade--active {
    box-shadow: inset 5px 5px 5px rgba(0,0,0,.15);
}

.decades--only-child .decade {
    width: 100%;
}

.underline {
    display: block;
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: 0;
    height: var(--underline-height);
    width: 50%;
    padding: 0;
    background: black;
    pointer-events: none;
    mix-blend-mode: multiply;
    transition: transform var(--transition-duration) ease-in-out; 
    border-radius: 100% 100% 0 0;
}

.decades--only-child .underline {
    width: 100%;
}

.underline:nth-child(1) {
    transition: calc(var(--transition-duration) * .8);
    background: gold;
}

.underline:nth-child(2) {
    transition: calc(var(--transition-duration) * 1.2);
    background: dodgerblue;
}

.underline:nth-child(3) {
    background: tomato;
}
`;