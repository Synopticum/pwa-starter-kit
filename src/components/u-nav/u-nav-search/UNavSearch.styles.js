import {css} from 'lit-element/lit-element';

export default css`
:host {
    cursor: default;
    position: relative;
    top: -35px;
    left: -5px;
    box-sizing: border-box;
}

:host([hidden]) {
    display: none;
}

:host * { 
    box-sizing: border-box; 
}

.u-nav-search {
    width: 350px;
    padding: 27px 15px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,0));
}

.controls {
    display: flex;
}

.controls__textinput {
    display: block;
    width: 100%;
    flex: 1;
    font-family: inherit;
    font-size: 18px;
    outline: none;
    border: 0;
    background: #fff;
    border-radius: 10px;
    padding: 15px;
}

.controls--active .controls__textinput {
    border-radius: 10px 10px 0 0;
}

.results-wrapper {
    background: #fff;
    border-radius: 0 0 10px 10px;
    padding: 0 15px 15px 10px;
}

.results {
    overflow-y: auto;
    max-height: calc(100vh - 170px);
}

.results::-webkit-scrollbar-track {
    background-color: #fff;
}

.results::-webkit-scrollbar {
    width: 5px;
    background-color: #fff;
}

.results::-webkit-scrollbar-thumb {
    background-color: #111;
}

.results__entry {
    cursor: default;
    padding: 3px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: .3s;
}

.results__entry:first-child {
    border: 0;
}

.results__entry:hover {
    background: #fafafa;
    color: #111;
}

.results__entry-tag {
    width: 36px;
    height: 36px;
    background: red;
    margin-right: 5px;
    font-size: 11px;
    opacity: .2;
    transition: opacity .3s;
}

.results__entry:hover .results__entry-tag {
    opacity: 1;
}

.results__entry-tag--house {
    background: url('/static/images/components/u-nav/u-nav-search/house.svg') no-repeat 50% 50%;
    background-size: 20px;
}

.results__entry-tag--building {
    background: url('/static/images/components/u-nav/u-nav-search/building.svg') no-repeat 50% 50%;
    background-size: 20px;
}

.results__entry-tag--dot {
    background: url('/static/images/components/u-nav/u-nav-search/dot.svg') no-repeat 50% 50%;
    background-size: 20px;
}

.results__entry-tag--street {
    background: url('/static/images/components/u-nav/u-nav-search/street.svg') no-repeat 50% 50%;
    background-size: 36px;
}

.results__entry-title {
    color: #555;
    transition: color .3s;
}

.results__entry:hover .results__entry-title {
    color: #111;
}
`;