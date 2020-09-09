import {css} from 'lit-element/lit-element';

export default css`
:host {
    cursor: default;
    position: relative;
    top: -80px;
    left: -5px;
    box-sizing: border-box;
}

:host([hidden]) {
    display: none;
}

:host * { 
    box-sizing: border-box; 
}

.u-nav-stats {
    width: 550px;
    padding: 16px 15px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 30px);
    background: linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,0));
}

.wrapper {
    position: relative;
    background: #fff;
    border-radius: 10px;
    padding: 15px;
    min-height: 200px;
    height: 100%;
}

.wrapper::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 70px;
    width: 0; 
    height: 0; 
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent; 
    border-right: 10px solid #fff; 
}

.wrapper::after {
    content: '';
    pointer-events: none;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    border-radius: 0 0 10px 10px;
    background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1));
}

.nav {
    list-style: none inside;
    padding: 0;
    margin: 0;
}

.nav__group-title {
    color: #666;
    font-size: 18px;
}

.values {
    list-style: disc inside;
    padding: 0;
    margin: 5px 0 10px 0;
}

.values__button {
    margin: 3px 0;
}

.values__button:hover {

}

.values__button-title {
    cursor: pointer;
    font-size: 16px;
    text-decoration: underline;
    transition: color .2s;
}

.values__button-title:hover {
    color: rgb(147, 55, 53);
}
`;