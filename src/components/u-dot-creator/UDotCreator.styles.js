import {css} from 'lit-element/lit-element';
export default css`
:host {
    position: fixed;
    padding: 10px;
    z-index: 200;
    width: 100%;
    max-width: 300px;
    transform: scale(1);
    transition: transform .3s;
    border: 3px solid #6B9B29;
    border-radius: 3px;
    background-color: #f9f9f9;
    box-shadow: 4px 4px 4px rgba(0,0,0,.15);
}

:host([hidden]) {
    display: block !important;
    transform: scale(0);
}

@keyframes bounce { 
  0% {transform: scale(.3);}
  50% {transform: scale(1.3);}
}

.bounce {
    content: '';
    position: absolute;
    left: -7.5px;
    top: -7.5px;
    width: 15px;
    height: 15px;
    background-color: #f00;
    border-radius: 50%;
    user-select: none;
    animation: bounce 1s alternate infinite linear;
}

.close {
    position: absolute;
    right: 50px;
    bottom: -15px;
}

.submit {
    position: absolute;
    right: -15px;
    bottom: -15px;
}
`;