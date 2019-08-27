import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 200;
    width: 400px;
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    background-color: rgba(255,255,255,.95);
    border-left: 2px solid rgba(111,155,52,.95);
}

.title {
    font-size: 24px;
}

.controls {
}

.controls__segment {
    padding: 10px 0;
    border-bottom: 2px solid rgb(111, 155, 52);
}

.controls__segment-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.controls__section {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
}

.controls__label {
    font-size: 14px;
    font-style: italic;
    display: block;
    margin-bottom: 5px;
}

.controls__segment:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
}

.controls__section:first-of-type {
    padding-top: 0;
}

.controls__section:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
}
`;