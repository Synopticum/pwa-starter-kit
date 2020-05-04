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
    filter: saturate(0);
    opacity: .5;
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
    pointer-events: none;
    border-radius: 10px 0 0 10px;
    box-shadow: inset 3px 3px 3px rgba(0,0,0,.5);
    filter: saturate(1);
    opacity: 1;
}

:host([disabled]) {
    pointer-events: none;
    cursor: default;
    filter: saturate(0);
    opacity: .5;
}

:host([active])::after,
:host([active]):hover::after {
    opacity: 1;
    height: 48px;
    top: -2px;
}

// news
:host {}
:host([type="news"]) {
    background-image: url('/static/images/nav/news.png');
}

@media (-webkit-min-device-pixel-ratio: 2) { 
    :host([type="news"]) {
        background-image: url('/static/images/nav/news@2x.png');
    }
}

:host([type="news"][active]) {
    border-color: #428ef2;
}

:host([type="news"][active])::after {
    background-color: #428ef2;
}

// transport
:host {}
:host([type="transport"]) {
    background-image: url('/static/images/nav/transport.png');
}

@media (-webkit-min-device-pixel-ratio: 2) { 
    :host([type="transport"]) {
        background-image: url('/static/images/nav/transport@2x.png');
    }
}

:host([type="transport"][active]) {
    border-color: rgb(111, 155, 52);
}

:host([type="transport"][active])::after {
    background-color: rgb(111, 155, 52);
}

// services
:host {}
:host([type="services"]) {
    background-image: url('/static/images/nav/services.png');
}

@media (-webkit-min-device-pixel-ratio: 2) { 
    :host([type="services"]) {
        background-image: url('/static/images/nav/services@2x.png');
    }
}

:host([type="services"][active]) {
    border-color: #3fc4cd;
}

:host([type="services"][active])::after {
    background-color: #3fc4cd;
}

// ads
:host {}
:host([type="ads"]) {
    background-image: url('/static/images/nav/ads.png');
}

@media (-webkit-min-device-pixel-ratio: 2) { 
    :host([type="ads"]) {
        background-image: url('/static/images/nav/ads@2x.png');
    }
}

:host([type="ads"][active]) {
    border-color: #85a119;
}

:host([type="ads"][active])::after {
    background-color: #85a119;
}

// anonymous
:host {}
:host([type="anonymous"]) {
    background-image: url('/static/images/nav/anonymous.png');
}

@media (-webkit-min-device-pixel-ratio: 2) { 
    :host([type="anonymous"]) {
        background-image: url('/static/images/nav/anonymous@2x.png');
    }
}

:host([type="anonymous"][active]) {
    border-color: #ccc;
}

:host([type="anonymous"][active])::after {
    background-color: #ccc;
}

// claims
:host {}
:host([type="claims"]) {
    background-image: url('/static/images/nav/claims.png');
}

@media (-webkit-min-device-pixel-ratio: 2) { 
    :host([type="claims"]) {
        background-image: url('/static/images/nav/claims@2x.png');
    }
}

:host([type="claims"][active]) {
    border-color: #bf2f39;
}

:host([type="claims"][active])::after {
    background-color: #bf2f39;
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
`;