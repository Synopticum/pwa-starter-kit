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
    width: 450px;
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
    padding: 15px 25px;
    min-height: 200px;
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

.streets {
    position: relative;
}

.streets__title {
    display: flex;
    justify-content: center;
    align-items: center;
}

.streets__title-text {
    display: inline-flex;
    padding: 3px 17px;
    font-size: 11px;
    text-align: center;
    margin-bottom: 15px;
    text-transform: uppercase;
    background-color: #ffffff;
    color: #111;
    border-radius: 5px;
}

.streets__graphic {

}

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