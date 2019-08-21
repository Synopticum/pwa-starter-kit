import {html, LitElement} from 'lit-element/lit-element';
import {DateTime} from "luxon";
import props from './UComment.props';
import styles from './UComment.styles';

export class UComment extends LitElement {
  /*
      List of required methods
      Needed for initialization, rendering, fetching and setting default values
  */
  static get properties() {
    return props;
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`  
      <div class="u-comment"> 
        <div class="comment ${this.isDeleting ? 'comment--is-deleting' : ''}">
          <div class="comment__text">${this.comment.text}</div>
            
          <div class="comment-meta">
              <div class="comment-meta__author">${this.comment.author} / </div>
              <div class="comment-meta__date">${UComment._getDate(this.comment.date)}</div>
          </div>
          
          <div class="comment-controls">
            ${this.isDeletingAllowed ? html`<div class="comment-controls__delete" @click="${this.delete}"></div>` : ''}
          </div>
        </div>
      </div>
    `
  }

  firstUpdated() {
    this._init();
  }

  _init() {
    this._setReferences();
    this._setListeners();
  }

  _setReferences() {

  }

  _setListeners() {

  }

  /*
      List of custom component's methods
      Any other methods
  */
  delete() {
    this.dispatchEvent(new CustomEvent('delete', { detail: this.comment.id, composed: true }));
  }

  static _getDate(unixtime) {
    return DateTime
            .fromMillis(parseInt(unixtime))
            .setLocale('ru')
            .toLocaleString(DateTime.DATETIME_MED);
  }
}

window.customElements.define('u-comment', UComment);