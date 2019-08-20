import {css} from 'lit-element/lit-element';
export default css`
.default-spinner {
    display: block;
    position: relative;
    width: 64px;
    height: 22px;
    margin: 0 auto;
}

.default-spinner__circle {
    position: absolute;
    top: calc(50% - 6px);
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: #10abff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.default-spinner__circle:nth-child(1) {
    left: 6px;
    animation: default-spinner-1 0.6s infinite;
}

.default-spinner__circle:nth-child(2) {
    left: 6px;
    animation: default-spinner-2 0.6s infinite;
}

.default-spinner__circle:nth-child(3) {
    left: 26px;
    animation: default-spinner-2 0.6s infinite;
}

.default-spinner__circle:nth-child(4) {
    left: 45px;
    animation: default-spinner-3 0.6s infinite;
}

@keyframes default-spinner-1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
}

@keyframes default-spinner-2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(19px, 0);
    }
}

@keyframes default-spinner-3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
}
`;