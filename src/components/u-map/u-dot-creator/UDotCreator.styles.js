import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed;
    z-index: 200;
    transition: transform .3s;
}

:host([hidden]) {
    display: block !important;
    transform: scale(0);
}

.buttons {
    margin: 0;
    position: absolute;
    white-space: nowrap;
    top: 10px;
    left: -44px;
}

#wrapper {
    position: absolute;
    right: calc(100% - 10px);
    bottom: calc(100% - 20px);
    display: table;
    width: 20px;
}

#wrapper-inner {
    display: table-cell;
    vertical-align: middle;
    width: 100%;
    height: 100%;
}

#scroll-down {
    display: block;
    position: relative;
    padding-top: 39px;
    text-align: center;
}
.arrow-down {
    display: block;
    margin: 0 auto;
    width: 10px;
    height: 38px;
}

.arrow-down:after {
    content: '';
    display: block;
    margin: 0;
    padding: 0;
    width: 8px;
    height: 8px;
    border-top: 2px solid #fff;
    border-right: 2px solid #fff;
    transform: rotate(135deg);
}
#scroll-down::before {    
    animation: elasticus 1.2s cubic-bezier(1, 0, 0, 1) infinite;    
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -1px;
    width: 2px;
    height: 50px;
    background: #fff;
    content: ' ';
}

@keyframes elasticus {
    0% {
        transform-origin: 0 0;
        transform: scale(1, 0);
    }
    50% {
        transform-origin: 0 0;
        transform: scale(1, 1);
    }
    50.1% {
        transform-origin: 0 100%;
        transform: scale(1, 1);
    }
    100% {
        transform-origin: 0 100%;
        transform: scale(1, 0);
    }
}
`;