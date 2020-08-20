import {css} from 'lit-element/lit-element';

export default css`
:host {
    display: block;
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 100%;
    border: 2px solid #000;
    box-shadow: inset 7px 7px 7px rgba(255,255,255,.1);
    transition: box-shadow .2s, border-radius .2s;
    margin-bottom: 7px;
    // opacity: .5;
}

:host::after {
    content: '';
    position: absolute;
    right: -10px;
    top: -2px;
    width: 10px;
    height: 48px;
    background: #666;
    opacity: 0;
    transition: opacity .3s;
}

:host(:hover) {
    opacity: 1;
    filter: saturate(1);
}

:host(:hover)::after {
    opacity: 0;
    top: 0;
    height: 44px;
}

:host(:active) {
    box-shadow: inset 3px 3px 3px rgba(0,0,0,.5);
}

:host([active]) {
    opacity: 1;
}

:host([disabled]) {
    pointer-events: none;
    cursor: default;
    filter: saturate(0);
    opacity: .5;
}

// search
:host {}
:host([type="search"]) {
    background-image: url('/static/images/u-nav/u-nav-button/search.svg');
    background-size: 24px;
}

:host([type="search"][active]) {
    background-image: url('/static/images/u-nav/u-nav-button/close.svg');
    background-size: 24px;
}

// search
:host {}
:host([type="stats"]) {
    background-image: url('/static/images/u-nav/u-nav-button/stats.svg');
    background-size: 24px;
}

:host([type="stats"][active]) {
    background-image: url('/static/images/u-nav/u-nav-button/close.svg');
    background-size: 24px;
}

.title {
    --color: #000;
    opacity: 0;
    position: absolute;
    left: calc(100% + 18px);
    top: 4px;
    display: flex;
    height: 36px;
    padding: 0 10px;
    align-items: center;
    background: var(--color);
    border-radius: 5px;
    font-size: 12px;
    color: #fff;
    text-transform: uppercase;
    transition: opacity .3s;
    white-space: nowrap;
}

:host(:hover) .title {
    opacity: 1;
}

.title::before {
    content:'';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    left: -8px;
    top: calc(50% - 8px);
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid var(--color);
}

:host([active]) .title {
    opacity: 0;
}

.feature {
    position: absolute;
    left: calc(100% + 15px);
    top: 5px;
}
`;