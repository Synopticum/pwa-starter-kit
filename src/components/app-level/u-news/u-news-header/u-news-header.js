/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html, LitElement } from '@polymer/lit-element';
import { SharedStyles } from '../../../shared-styles.js';
import { PageViewElement } from '../../../reusable/page-view-element';
import { connect } from 'pwa-helpers/connect-mixin';

import { store } from '../../../../store';

import news from '../../../../reducers/news.js';
store.addReducers({
  news
});

class UNewsHeader extends connect(store)(LitElement) {

  static get properties() {
  }

  _render({ }) {
    return html`
      ${SharedStyles}
      
      <style>
        :host {
            grid-area: header;
            display: grid;
            height: 100%;
            margin-bottom: 10px;            
            grid: 
              'label     today      today      date' 35px
              'logo      title      title      date' 110px
              'since     weather    weather    date' 35px /
              200px      2fr        2fr        .7fr
        }
        
        .header__label {
            grid-area: label;
            border-top: 2px solid grey;
            padding: 3px 0;
            border-bottom: 2px solid grey;
        }
        
        .header__label .label {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            background-color: #111111;
            color: #ffffff;
            text-align: center;
            text-transform: uppercase;
            font-size: 14px;
        }
        
        .header__today {
            grid-area: today;
            border-top: 2px solid grey;
            border-bottom: 2px solid grey;
            padding: 1px 20px 3px 20px;
            font-style: italic;
            font-weight: bold;
        }
        
        .today {
            display: flex;
            align-items: center;
            height: 100%;
        }
        
        .header__date {
            grid-area: date;
            display: flex;
            align-items: flex-end;
            border-top: 2px solid grey;
            padding: 3px 0 10px 10px;
        }
        
        .header__date .date {
            width: 50%;
            text-align: center;
            line-height: 1.2;
        }
        
        .header__date .day-of-week {
            font-size: 13px;
        }
        
        .header__date .day {
            font-size: 42px;
            font-weight: bold;
        }
        
        .header__date .month-and-year {
            font-size: 13px;
        }
        
        .header__logo {
            grid-area: logo;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 5px;
        }
        
        .header__title {
            grid-area: title;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 0 20px;
        }
        
        .header__title .title {
            font-size: 60px;
            font-weight: bold;
        }
        
        .header__title .subtitle {
            position: relative;
            top: -15px;
            font-size: 15px;
            font-style: italic;
        }
        
        .header__since {
            grid-area: since;
            text-align: center;
            line-height: 1.2;
            font-size: 12px;
            padding: 3px 0;
        }
        
        .header__weather {
            grid-area: weather;
            display: flex;
            align-items: center;
            border-top: 2px solid grey;
            padding: 0 20px;
        }
      </style>
      
      <div class="header__label">
        <div class="label">Сегодня в номере</div>
      </div>
      
      <div class="header__today">
        <div class="today">Ютазинцы на первенстве мира, стр. 2</div>
      </div>
      
      <div class="header__date">
        <div class="date">
            <div class="day-of-week">четверг</div>
            <div class="day">16</div>
            <div class="month-and-year">август 2018</div>
        </div>
      </div>
      
      <div class="header__logo">
        <img src="/static/images/herb.gif" height="95">
      </div>
      
      <div class="header__title">
        <div class="title">Уруссинская старь</div>
        <div class="subtitle">Коллективная газета Ютазинского района</div>
      </div>
      
      <div class="header__since">
        Газета не была основана<br>
        Номер 42(335)
      </div>
      
      <div class="header__weather">
        Температура по приборам +17,6°, реально +15°, может ливануть
      </div>
`;
  }

  _stateChanged(state) {
  }
}

window.customElements.define('u-news-header', UNewsHeader);
