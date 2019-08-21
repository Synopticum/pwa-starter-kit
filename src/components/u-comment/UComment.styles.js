import {css} from 'lit-element/lit-element';

export default css`
:host {
    display: block;
    position: relative;
    padding: 10px 0;
    margin: 10px 0;
    border-bottom: 1px solid #ccc;
    line-height: 1.3;
}

:host([hidden]) {
    display: none;
}

.comment {
    opacity: 1;
    transition: opacity .3s;
}

.comment--is-deleting {
    opacity: .1;
    text-decoration: line-through;
}

.comment__text {
    font-size: 14px;
}

.comment-meta {
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    margin-top: 5px;
}

.comment-meta__date {
    margin-left: 5px;
}

.comment-controls {
    position: absolute;
    right: 0;
    top: 10px;
}

.comment-controls__delete {
    cursor: pointer;
    display: block;
    width: 12px;
    height: 12px;
    background: url("static/images/button-icons/x.svg") no-repeat 50% 50%;
}
`;