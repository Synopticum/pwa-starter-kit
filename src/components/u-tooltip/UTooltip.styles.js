import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed;
    z-index: 200;
    transform: scale(1);
    transition: transform .3s;
    background-size: cover;
    box-sizing: border-box;
}

:host(.tooltip--dot) {
  width: 120px;
  height: 120px;
}

:host(.tooltip--path) {
  width: 200px;
  height: 30px;
  text-align: center;
}

:host([hidden]) {
    display: block !important;
    transform: scale(0);
}
        
.thumbnail {
    object-fit: cover;
    border-radius: 50%;
}

.thumbnail--old-and-new {
    border: 3px solid rgb(214,183,98);
}

.thumbnail--old {
    border: 3px solid #ccc;
}

.thumbnail--new {
    border: 3px solid #91B64A;
}

.path-tooltip {
  background-color: rgba(255,255,255,.95);
  border-radius: 5px;
  padding: 2px 8px;
}
`;