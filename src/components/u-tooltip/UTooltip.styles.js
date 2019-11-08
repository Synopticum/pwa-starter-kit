import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed;
    z-index: 200;
    transform: scale(1);
    transition: transform .3s;
    background-size: cover;
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
`;