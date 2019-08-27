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
        <div class="user" title="${this.comment.author}" style="background-color: ${UComment.stringToColour(this.comment.author)}">${UComment._getInitial(this.comment.author)}</div>
        
        <div class="comment ${this.isDeleting ? 'comment--is-deleting' : ''}">
          <div class="comment__text">${this.comment.text}</div>
            
          <div class="comment-meta">
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

  static _getInitial(author) {
    const [firstName, lastName] = author.split(' ');
    return `${firstName[0]}${lastName[0]}`;
  }

  static stringToColour(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
  }
}

window.customElements.define('u-comment', UComment);