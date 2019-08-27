import {css} from 'lit-element/lit-element';

export default css`
:host {
    display: flex;
}

:host([hidden]) {
    display: none;
}

.u-photo-upload {

}

/* select */
.select-decade {
    display: none;
}

.select-decade--active {
    display: block;
    margin: 10px 0;
}

/* upload button */
.upload {
    display: none;
}

.upload--active {
    display: inline-flex;
}
`;