import {css} from 'lit-element/lit-element';

export default css`
:host {
    align-self: flex-end;
    margin-left: -2px;
}
        
.user {

}

.user__image {
    position: relative;
    z-index: 20;
    cursor: pointer;
    width: 44px;
    height: 44px;
    background-size: cover;
    border-radius: 10px;
    overflow: hidden;
    text-indent: -9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #111;     
    transition: box-shadow .2s;          
}

.user__image--none {
    text-indent: 0;
}

.user__image:hover {
    box-shadow: inset 2px 2px 2px rgba(0,0,0,.5);
}

.user__image:active {
    box-shadow: inset 3px 3px 3px rgba(0,0,0,.75);
}
        
.login {
    display: flex;
    width: 44px;
    height: 44px;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    z-index: 100;
    opacity: .5;
    transition: opacity .3s;
}

.login:hover {
    opacity: 1;
}

.login svg {
    width: 34px;
    height: 34px;
}
`;