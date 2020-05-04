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
.select-year {
    display: none;
}

.select-year--active {
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