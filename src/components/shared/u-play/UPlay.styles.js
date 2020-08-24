import {css} from 'lit-element/lit-element';

export default css`
:host {
    cursor: pointer;
    display: flex;
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
    background: url('/static/images/components/shared/u-play/play.svg') no-repeat 50% 50%;
    background-size: 40px;
}

:host([in-progress]) {
    background-image: url('/static/images/components/shared/u-play/pause.svg');
}
`;
