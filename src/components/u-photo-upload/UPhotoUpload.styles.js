import {css} from 'lit-element/lit-element';

export default css`
:host {
    display: flex;
}

:host([hidden]) {
    display: none;
}

.u-photo-upload {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* select */
.select-decade {
    display: none;
}

.select-decade--active {
    display: inline-flex;
}

/* upload button */
.upload {
    display: none;
    margin-left: 15px;
    --border-radius: 15px;
}

.upload--active {
    display: inline-flex;
}
`;