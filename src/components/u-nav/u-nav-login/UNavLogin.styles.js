import {css} from 'lit-element/lit-element';

export default css`
:host {
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
    border: 2px solid #ccc;
    box-shadow: inset 7px 7px 7px rgba(255,255,255,.1);
    transition: box-shadow .2s;       
}

.user__image--none {
    text-indent: 0;
}

.user__image:hover {
    box-shadow: inset 7px 7px 7px rgba(255,255,255,.2);
}

.user__image:active {
    box-shadow: inset 7px 7px 7px rgba(0,0,0,.4);
}
        
.login {
    display: block;
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 100%;
    border: 2px solid #000;
    box-shadow: inset 7px 7px 7px rgba(255,255,255,.1);
    transition: box-shadow .2s, border-radius .2s;
    margin-bottom: 7px;
    background-image: url('/static/images/components/u-nav/u-nav-login/vk.svg');
    background-size: 30px;
}

.login::after {
    position: absolute;
    right: -10px;
    top: -2px;
    width: 10px;
    height: 48px;
    background: #666;
    opacity: 0;
    transition: opacity .3s;
}

.login:hover {
    opacity: 1;
    filter: saturate(1);
}

.login:hover::after {
    opacity: 0;
    top: 0;
    height: 44px;
}

.login:active {
    box-shadow: inset 3px 3px 3px rgba(0,0,0,.5);
}

.login[active] {
    opacity: 1;
}

.login[disabled] {
    pointer-events: none;
    cursor: default;
    filter: saturate(0);
    opacity: .5;
}

.login .title {
    --color: #000;
    opacity: 0;
    position: absolute;
    left: calc(100% + 18px);
    top: 4px;
    display: flex;
    height: 36px;
    padding: 0 10px;
    align-items: center;
    background: var(--color);
    border-radius: 5px;
    font-size: 12px;
    color: #fff;
    text-transform: uppercase;
    transition: opacity .3s;
    white-space: nowrap;
}

.login:hover .title {
    opacity: 1;
}

.title::before {
    content:'';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    left: -8px;
    top: calc(50% - 8px);
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid var(--color);
}

.login[active] .title {
    opacity: 0;
}
`;