import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed;
    z-index: 200;
    opacity: 0;
    transition: opacity .3s;
    box-sizing: border-box;
}

:host(.tooltip--dot) {
  opacity: 1;
  height: 145px;
}

:host(.tooltip--path) {
  display: flex;
  height: 30px;
}

:host(.tooltip--object) {
  opacity: 1;
  display: flex;
  min-height: 60px;
}

:host([hidden]) {
  display: block !important;
  opacity: 0;
  pointer-events: none;
}

.u-tooltip {
  display: flex;
  width: 100%;
}

.tooltip-wrapper {
  position: relative;
  width: 100%;
  background: #fff;
  display: flex;
  padding: 5px;
  border-radius: .28571429rem;
  box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset, 0 1px 2px rgba(0,0,0,.3);
  box-sizing: border-box;
  align-items: center;
}
        
.tooltip-wrapper::before {
  position: absolute;
  content: '';
  width: 0; 
  height: 0; 
}

:host(.tooltip--dot.tooltip--top-left) .tooltip-wrapper,
:host(.tooltip--dot.tooltip--bottom-left) .tooltip-wrapper {
    margin-left: 30px;
}

:host(.tooltip--dot.tooltip--top-right) .tooltip-wrapper,
:host(.tooltip--dot.tooltip--bottom-right) .tooltip-wrapper {
    margin-right: 30px;
}

:host(.tooltip--object.tooltip--top-left) .tooltip-wrapper,
:host(.tooltip--object.tooltip--bottom-left) .tooltip-wrapper {
    margin-left: 20px;
}

:host(.tooltip--object.tooltip--top-right) .tooltip-wrapper,
:host(.tooltip--object.tooltip--bottom-right) .tooltip-wrapper {
    margin-right: 20px;
}

:host([hidden]) .tooltip-wrapper::before {
    display: none;
}

:host(.tooltip--top-left) .tooltip-wrapper::before,
:host(.tooltip--bottom-left) .tooltip-wrapper::before {
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 7px solid #fff;
}

:host(.tooltip--top-right) .tooltip-wrapper::before,
:host(.tooltip--bottom-right) .tooltip-wrapper::before {
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 7px solid #fff;
}
        
:host(.tooltip--top-left) .tooltip-wrapper::before {
  top: 20px;
  left: -7px;
}
        
:host(.tooltip--top-right) .tooltip-wrapper::before {
  top: 20px;
  right: -7px;
}
        
:host(.tooltip--bottom-left) .tooltip-wrapper::before {
  bottom: 20px;
  left: -7px;
}
        
:host(.tooltip--bottom-right) .tooltip-wrapper::before {
  bottom: 20px;
  right: -7px;
}

.thumbnail {
  cursor: pointer;
  object-fit: cover;
}

.content {
    position: absolute;
    font-size: 0;
}

:host(.tooltip--top-right) .content,
:host(.tooltip--bottom-right) .content {
    text-align: right;
}

.title {
    display: inline-block;
    white-space: nowrap;
    font-size: 18px;
    padding: 7px 10px;
    background: #111;
    color: #fff;
}

.short-description {
    display: inline-block;
    white-space: nowrap;
    font-size: 10px;
    text-transform: uppercase;
    color: #111;
    background: #e8a826;
    padding: 3px 10px;
    margin: 0 0px;
}

:host(.tooltip--dot) .title {
  margin-bottom: 0;
}

.description {
  font-size: 14px;
  line-height: 1.4;
}

.path-tooltip {
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  font-size: 18px;
}

.image {
    font-size: 0;
    width: 90px;
    height: 90px;
    animation: bounce 1s linear infinite alternate;
    border-radius: 3px;
}

@keyframes bounce {
  0%, 100% {
    background-color: #eee;
  }
  50% {
    background-color: #ccc;
  }
}
`;