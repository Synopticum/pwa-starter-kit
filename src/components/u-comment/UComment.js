import {html, LitElement} from 'lit-element/lit-element';
import {styleMap} from 'lit-html/directives/style-map';
import {classMap} from 'lit-html/directives/class-map';
import {DateTime} from "luxon";
import props from './UComment.props';
import styles from './UComment.styles';
import {connect} from "pwa-helpers/connect-mixin";
import {store} from "../../store";
import {fetchAvatar} from './UComment.actions';

export class UComment extends connect(store)(LitElement)  {
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
    let commentClasses = {
      'comment': true,
      'comment--is-deleting': this.isDeleting
    };

    return html`  
      <div class="u-comment"> 
        <div class="user">
            ${this._avatarUrl ? 
               UComment.renderAvatar(this._avatarUrl, this.comment.authorVkId, this.comment.author) : 
               UComment.renderAvatarPlaceholder(this.comment.author)}
        </div>
        
        <div class="${classMap(commentClasses)}">
          <div class="comment__text">${this.comment.text}</div>
            
          <div class="comment-meta">
              <div class="comment-meta__date">${UComment._getDate(this.comment.date)}</div>
          </div>
          
          <div class="comment-controls">
            ${this.isDeletingAllowed ? html`<div class="comment-controls__delete" @click="${this.delete}" title="Удалить комментарий"></div>` : ''}
          </div>
        </div>
      </div>
    `
  }

  constructor() {
    super();
    this.isDeleting = false;
    this.isDeletingAllowed = false;
  }

  stateChanged(state) {
    this._avatarUrl = state.app.user.avatarsCache[this.comment.authorId];
  }

  async firstUpdated() {
    await this._init();
  }

  _init() {
    this._setReferences();
    this._setListeners();

    store.dispatch(fetchAvatar(this.comment.authorId));
  }

  _setReferences() {

  }

  _setListeners() {

  }

  /*
      List of custom component's methods
      Any other methods
  */
  static renderAvatar(avatarUrl, authorVkId, author) {
    return authorVkId ?
        html`<a href="https://vk.com/id${authorVkId}" target="_blank"><img src="${avatarUrl}" class="user__avatar-image" alt="${author}"></a>` :
        html`<img src="${avatarUrl}" class="user__avatar-image" alt="${author}">`;
  }

  static renderAvatarPlaceholder(author) {
    let styles = { backgroundColor: UComment.stringToColour(author) };

    return html`<div class="user__avatar-placeholder" 
                     title="${author}" 
                     style="${styleMap(styles)}">${UComment._getInitial(author)}</div>`
  }

  delete() {
    this.dispatchEvent(new CustomEvent('delete', { detail: this.comment.id, composed: true }));
  }

  static _getDate(unixtime) {
    return DateTime
            .fromMillis(parseInt(unixtime))
            .setLocale('ru')
            .toLocaleString(DateTime.DATE_HUGE);
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