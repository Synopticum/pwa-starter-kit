import {css} from 'lit-element/lit-element';

export default css`
.controls {
    position: absolute;
    z-index: 150;
    width: 100%;
    box-sizing: border-box;
    left: 0;
    bottom: 0;
    padding: 20px;
    background-color: rgba(0,0,0,.75);
    display: flex;
    justify-content: space-between;
}

.controls__label {
    display: flex;
}

.controls__type {
    display: flex;
}

.select-type, .select-label, .select-layer {
    margin: 0 10px;
}

.controls__dot {
    display: flex;
}

.controls__photo {
    display: flex;
}
`;