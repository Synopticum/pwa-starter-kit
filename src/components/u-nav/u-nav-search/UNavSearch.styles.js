import {css} from 'lit-element/lit-element';

export default css`
:host {
    cursor: default;
    position: relative;
    top: -25px;
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
    height: calc(100vh - 30px);
    background: #fff;
    padding: 27px 15px;
    border-radius: 0;
    display: flex;
    flex-direction: column;
}

.controls {
    display: flex;
}

.controls__textinput {
    display: block;
    flex: 1;
}

.results {
    margin-top: 20px;
    overflow-y: auto;
    padding-right: 20px;
}

.results::-webkit-scrollbar-track {
    background-color: #F5F5F5;
}

.results::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
}

.results::-webkit-scrollbar-thumb {
    background-color: #000000;
}

.results__entry {
    cursor: default;
    padding: 3px 0;
    cursor: pointer;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
}

.results__entry:first-child {
    border: 0;
}

.results__entry:hover {
    background: #fafafa;
}

.results__entry-tag {
    width: 36px;
    height: 36px;
    background: red;
    margin-right: 5px;
    font-size: 11px;
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
}
`;