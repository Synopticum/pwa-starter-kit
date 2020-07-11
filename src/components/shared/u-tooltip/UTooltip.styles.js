import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed;
    z-index: 200;
    overflow: hidden;
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
  padding: 10px;
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
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #fff;
}

:host(.tooltip--top-right) .tooltip-wrapper::before,
:host(.tooltip--bottom-right) .tooltip-wrapper::before {
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #fff;
}
        
:host(.tooltip--top-left) .tooltip-wrapper::before {
  top: 20px;
  left: -10px;
}
        
:host(.tooltip--top-right) .tooltip-wrapper::before {
  top: 20px;
  right: -10px;
}
        
:host(.tooltip--bottom-left) .tooltip-wrapper::before {
  bottom: 20px;
  left: -10px;
}
        
:host(.tooltip--bottom-right) .tooltip-wrapper::before {
  bottom: 20px;
  right: -10px;
}

.thumbnail {
  object-fit: cover;
  border: 1px solid #ccc;
}

.title {
    white-space: nowrap;
}

:host(.tooltip--dot) .title {
  margin-bottom: 10px;
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
`;