import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed;
    z-index: 200;
    transform: scale(1);
    transition: transform .3s;
    box-sizing: border-box;
    background: #fff;
    border-radius: .28571429rem;
    box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgba(34,36,38,.15) inset, 0 1px 2px rgba(0,0,0,.3);
    
}

:host(.tooltip--dot) {
  width: 350px;
  height: 120px;
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
    transform: scale(0);
}
        
.thumbnail {
    object-fit: cover;
    border-radius: 50%;
}

.thumbnail--gold {
    border: 3px solid rgb(214,183,98);
}

.thumbnail--regular {
    border: 3px solid #91B64A;
}

.dot-tooltip {

}

.path-tooltip {
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  font-size: 18px;
}
`;