import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    --underline-height: 5px;
    --transition-duration: .5s;
}

.u-timeline {
    display: flex;
    flex-direction: row;
}

:host([hidden]) {
    display: none;
}

.years {
    position: relative;
    font-size: 16px;
    white-space: nowrap;
    padding: 0;
    margin-bottom: 10px;
    background-color: rgb(224, 225, 226);
    border-radius: 7px;
    overflow: hidden;
    box-shadow: transparent 0 0 0 1px inset, 
                rgba(34, 36, 38, 0.15) 0 0 0 0 inset, 
                rgba(0, 0, 0, 0.3) 0 1px 2px;
}

.years--only-child {
    width: 100px;
}

.year {
    display: inline-block;
    z-index: 10;
    padding: 9px 25px 10px 25px;
    text-align: center;
    cursor: pointer;
    text-transform: uppercase;
    transition: box-shadow .3s ease-out;
}

.year--active {
    box-shadow: inset 5px 5px 5px rgba(0,0,0,.15);
    border-bottom: 3px solid #000;
}

.years--only-child .year {
    width: 100%;
}
`;