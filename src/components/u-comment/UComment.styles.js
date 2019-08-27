import {css} from 'lit-element/lit-element';

export default css`
:host {
    display: block;
    position: relative;
    padding: 10px 0;
    margin: 10px 0;
    border-bottom: 1px solid rgba(111,155,52,.95);
    line-height: 1.3;
}

:host(:last-of-type) {
    border-bottom: 0;
}

:host([hidden]) {
    display: none;
}

.u-comment {
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-areas: 'user comment';
}

.user {
    cursor: default;
    grid-area: user;
}

.avatar {
    width: 40px;
    height: 40px;
    font-size: 20px;
    background-color: #111111;
    color: #ffffff;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: grayscale(30%);
}

.comment {
    grid-area: comment;
    opacity: 1;
    transition: opacity .3s;
}

.comment--is-deleting {
    opacity: .1;
    text-decoration: line-through;
}

.comment__text {
    font-size: 15px;
}

.comment-meta {
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    margin-top: 8px;
    color: rgb(172,172,172);
}

.comment-meta__date {
    margin-left: 5px;
}

.comment-meta__date:first-letter {
    text-transform: uppercase;
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
    background: red;
}
`;