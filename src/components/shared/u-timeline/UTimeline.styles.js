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
}

.u-timeline {
    display: flex;
    flex-direction: row;
}

:host([hidden]) {
    display: none;
}

.years {
    font-size: 14px;
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;
}

.years--only-child {

}

.year {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
    color: #fff;
    border-radius: 15px;
    padding: 5px 10px 4px 10px;
    margin: 0 7px;
    transition: background-color .3s;
    user-select: none;
}

.year::before, year::after {
    content: '';
}

.year:not(:last-child)::before {
    content: '';
    position: absolute;
    right: -14px;
    top: calc(50% - 1px);
    width: 14px;
    height: 2px;
    background: #000;
}

.year:not(:first-child)::before {
    display: none;
    content: '';
    position: absolute;
    left: -15px;
    top: calc(50% - 1px);
    width: 15px;
    height: 2px;
    background: #000;
    z-index: 50;
}

.nested-year:last-child .year::before {
    display: none;
} 

.year--active {
    color: #000;
    background: #e8a826;
}

.years--only-child .year {
    width: 100%;
}

.nested-year {
    display: flex;
    flex-direction: column-reverse;
}

.nested-year .year {
    margin: 5px 7px 0 7px;
    position: relative;
}

.nested-year .year:not(:last-child)::after {
    content: '';
    position: absolute;
    left: calc(50% - 1px);
    top: -5px;
    width: 2px;
    height: 5px;
    background: #000;
}

.nested-year .year:not(:first-child)::before,
.nested-year .year--active:not(:first-child)::before {
    display: none;
}
`;