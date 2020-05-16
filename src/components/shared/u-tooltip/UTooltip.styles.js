import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed;
    z-index: 200;
    width: 0;
    overflow: hidden;
    transition: width .3s;
    box-sizing: border-box;
}

:host(.tooltip--dot) {
  width: 350px;
  height: 140px;
}

:host(.tooltip--path) {
  width: 300px;
  height: 30px;
}

:host(.tooltip--object) {
  width: 300px;
  height: 30px;
}

:host([hidden]) {
    display: block !important;
    width: 0;
}

.dot-tooltip {
  position: relative;
  background: #fff;
  display: flex;
  padding: 10px;
  border-radius: .28571429rem;
  box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset, 0 1px 2px rgba(0,0,0,.3);
  box-sizing: border-box;
}
        
.dot-tooltip::before {
  position: absolute;
  content: '';
  width: 0; 
  height: 0; 
}

:host(.tooltip--top-left) .dot-tooltip,
:host(.tooltip--bottom-left) .dot-tooltip {
    margin-left: 30px;
}

:host(.tooltip--top-right) .dot-tooltip,
:host(.tooltip--bottom-right) .dot-tooltip {
    margin-right: 30px;
}

:host([hidden]) .dot-tooltip::before {
    display: none;
}

:host(.tooltip--top-left) .dot-tooltip::before,
:host(.tooltip--bottom-left) .dot-tooltip::before {
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #fff;
}

:host(.tooltip--top-right) .dot-tooltip::before,
:host(.tooltip--bottom-right) .dot-tooltip::before {
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #fff;
}
        
:host(.tooltip--top-left) .dot-tooltip::before {
  top: 20px;
  left: -10px;
}
        
:host(.tooltip--top-right) .dot-tooltip::before {
  top: 20px;
  right: -10px;
}
        
:host(.tooltip--bottom-left) .dot-tooltip::before {
  bottom: 20px;
  left: -10px;
}
        
:host(.tooltip--bottom-right) .dot-tooltip::before {
  bottom: 20px;
  right: -10px;
}

.path-tooltip {
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  font-size: 18px;
}
`;