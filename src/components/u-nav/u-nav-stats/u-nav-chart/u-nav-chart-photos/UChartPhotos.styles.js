import {css} from 'lit-element/lit-element';

export default css`
rect.line {
    position: relative;
    height: 12px;
    /*fill: #111;*/
    stroke: #fff;
    stroke-width: 2px;
}

rect.line:hover {
    opacity: .75;
}

text.label {
    font-size: 10px;
    fill: #ffffff;
}
`;