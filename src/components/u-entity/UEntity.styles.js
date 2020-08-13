import {css} from 'lit-element/lit-element';

export default css`
:host {
    display: flex;
    width: 100%;
}

:host([hidden]) {
    display: none;
}

:host([hidden]) {
    display: block !important;
    transform: scale(0);
    width: 0;
    height: 0;
}

.u-entity {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 200;
    pointer-events: all;
    border-radius: 3px;
}

.u-entity--loading {
    width: 100%;
    height: 100%;
    background: url('/static/images/spinner.gif') no-repeat 50% 50% transparent;
    box-shadow: none;
    border: 0;
}

.u-entity--loading .nav,
.u-entity--loading .image,
.u-entity--loading u-entity-timeline {
    display: none;
}

.nav {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 175;
}

.wrapper {
    width: 100%;
    height: 100%;
    font-size: 48px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form {
    position: relative;
    z-index: 150;
    padding: 15px 20px;
    background-color: rgba(0,0,0,.75);
}

.hide-comments {
    cursor: pointer;
    position: absolute;
    left: -37px;
    top: 50%;
    width: 30px;
    height: 40px;
    background: url('/static/images/button-icons/hide-comments.svg') no-repeat 50% 50% rgba(255,255,255,.95);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image {
    width: 100%;
    height: 100%;
    max-width: 95vw;
    max-height: 95vh;
    object-fit: contain;
    opacity: 1;
    transition: opacity .3s;
}

.image-overlay {
    display: none;
}

.image-overlay::before {
    content: '';
    position:absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
    background: linear-gradient(to left, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%);
    transition: opacity .3s;
}

.image-overlay--active {
    display: block;
}

.image-overlay--active::before {
    opacity: 1;
}

.hide-sidebar {
    position: absolute;
    right: 385px;
    top: 0;
}

.head {
    position: absolute;
    left: 20px;
    top: 20px;
    font-size: 0;
}

.head__title {
    display: inline-block;
    background: #111;
    color: #fff;
    padding: 0 10px;
    font-size: 36px;
}

.head__short-description {
    display: inline-block;
    background: #e8a826;
    color: #000;
    padding: 3px 10px;
    font-size: 12px;
    text-transform: uppercase;
}

@media only screen and (max-width: 992px)  {
  :host {
    width: 100vw;
    height: 100vh;
    border: 0;
    box-shadow: none;
  }

  .u-entity {
    width: 100%;
    height: 100%;
    border: 0;
  }
  
  .image {
    object-fit: cover;
    max-width: 100%;
    max-height: 100%;
  }
}}
`;