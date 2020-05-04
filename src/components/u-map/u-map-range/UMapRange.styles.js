import {css} from 'lit-element/lit-element';

export default css`
:host {
    position: fixed; 
    bottom: 15px; 
    left: calc(50% - 135px); 
    z-index: 25;
    width: 400px; 
    background: #111;
    padding: 15px 10px 0 10px;
}

.u-map-range {
  width: 400px;
  position: relative;
  height: 7px;
}

.wrapper {
  position: absolute;
  left: 13px;
  right: 15px;
  height: 7px;
  background-image:
      linear-gradient(90deg,
                       #5b6a6d,
                       #8e8e45  12.5%, 
                       #ffae1e  25%,
                       #aa0900   37.5%,
                       #737463   50%,
                       #82b332   62.5%,
                       #9658ff    75%,
                       #0069e6    87.5%,
                       #0069e6    100%);
}

.inverse {
  position: absolute;
  height: 5px;
  border-radius: 10px;
  margin: 0 7px;
  width: 70%;
}

.inverse--left {
  left: 0;
}

.inverse--right {
  right: 0;
}

.range {
  position: absolute;
  height: 5px;
  border-radius: 14px;
}

.thumb {
  position: absolute;
  top: -7px;
  z-index: 2;
  height: 20px;
  width: 20px;
  text-align: left;
  margin-left: -11px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
  background-color: #FFF;
  outline: none;
  opacity: 0;
}

input[type=range] {
  position: absolute;
  pointer-events: none;
  -webkit-appearance: none;
  z-index: 3;
  height: 60px;
  top: -50px;
  width: 100%;
  opacity: 0;
}

input[type=range]:focus::-webkit-slider-runnable-track {
  background: transparent;
  border: transparent;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]::-webkit-slider-thumb {
  pointer-events: all;
  width: 28px;
  height: 28px;
  border-radius: 0px;
  border: 0 none;
  background: red;
  -webkit-appearance: none;
}

.sign {
  cursor: default;
  user-select: none;
  position: absolute;
  margin-left: -23px;
  top: -46px;
  z-index: 3;
  background-color: #111;
  color: #fff;
  padding: 5px 8px;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  border-radius: 5px 5px 0 0;
}

.sign::before {
    content: '';
    position: absolute;
    width: 2px;
    height: 10px;
    left: 50%;
    margin-left: -1px;
    bottom: -5px;
    background: #fff;
}

.sign::after {
    --arrow-size: 7px;
    content:'';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    left: calc(50% - var(--arrow-size));
    top: calc(100% + 5px);
    border-right: var(--arrow-size) solid transparent;
    border-left: var(--arrow-size) solid transparent;
    border-top: var(--arrow-size) solid #fff;
}
`;