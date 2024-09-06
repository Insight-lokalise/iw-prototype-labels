// Import the LitElement base class and html helper function
import { LitElement } from 'lit-element';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';

class OptimalImg extends LitElement {

  static get properties() {
    return {
      alt: {type: String},
      class: {type: String},
      fallback: {type: String},
      intersected: {type: Boolean, reflect: true},
      loading: {type: String},
      src: {type: String},
      style: {type: String}
    }
  };

  set loading(property) {
    this.shallDisplay=true;
  }

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.shallDisplay = false;
    this.hasLoaded = false;
    this.hasError = false;
  }

  render() {
    const box = this.getBoundingClientRect();
    const classNames = 'c-image c-image--optimal ' + (!!this.class ? ' ' + this.class : '') + (this.hasLoaded ? ' c-image--is-loaded' : (this.hasError ? ' c-image--fallback' : ''));
    return html`
      <img style=${ifDefined(this.style)} class=${classNames} @load=${this.onLoadImage.bind(this)} @error=${this.onLoadError.bind(this)} alt=${ifDefined(this.alt)} src=${ifDefined(this.shallDisplay ? this.src : undefined)}>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.initIntersectionObserver();
  }

  disconnectedCallback(event) {
    super.disconnectedCallback();
    this.disconnectObserver();
  }

  initIntersectionObserver() {
    if (this.intersectionObserver) return;
    this.intersectionObserver = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this), {rootMargin: '500px'} // This is an extra large margin to load the image earlier when scrolling. We can reduce this value though.
    );
    this.intersectionObserver.observe(this);
  }

  intersectionObserverCallback(events) {
    let intersected = events.some((oi) => oi.isIntersecting);
    if (intersected) {
      this.displayImage();
    }
  }

  displayImage() {
    this.disconnectObserver();
    this.intersected = true;
    this.shallDisplay = true;
  }

  disconnectObserver() {
    if (!this.intersectionObserver) return;
    this.intersectionObserver.disconnect();
    this.intersectionObserver = null;
    delete this.intersectionObserver;
  }

  onLoadError(event) {
    const img = event.target;
    var computedStyles = getComputedStyle(img);
    this.hasError = true;
    switch(this.fallback) {
      case "blank": img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        img.classList.add('c-image--fallback-blank');
        break;
      case "nia": img.src="data:image/svg+xml, %3Csvg xmlns='https://www.w3.org/2000/svg' viewBox='0 0 240 180' className='c-image__fallback'%3E%3Cg%3E%3Cpath d='M158.8,42.6l-15-0.7l-0.9-9.8c-0.2-2.1-2-3.5-4.2-3.3l-53.9,4.4c-2.1,0.2-3.7,1.9-3.5,4l3.9,42.9 c0.2,2.1,2,3.5,4.2,3.3l2.7-0.2l-0.4,8.3c-0.1,2.3,1.7,4.2,4.1,4.3l60.1,2.9c2.4,0.1,4.4-1.6,4.5-3.9l2.5-47.9 C163,44.6,161.2,42.7,158.8,42.6z M94.2,43.6l-1.3,24.5l-3.2,4.5l-2.9-32.4v-0.1V40c0.2-0.9,0.8-1.6,1.7-1.7l47.5-3.9 c0.9-0.1,1.8,0.5,1.9,1.4c0,0,0.1,0,0.1,0.1c0,0,0.1,0,0.1,0.1l0.5,5.6l-39.9-1.9C96.3,39.6,94.3,41.3,94.2,43.6L94.2,43.6z M155,86.7l-15.4-18.1l-6.8,6.2l-12.6-14.7L97.8,83.9l1.9-36.2v-0.1c0.2-1,1.1-1.7,2.2-1.6l53,2.5c1.1,0.1,1.9,0.9,1.9,1.9 c0,0,0.1,0.1,0.1,0.1L155,86.7L155,86.7z'/%3E%3Cpath d='M122.1,53.7c2.8,0,5.2-2.3,5.2-5.2s-2.3-5.2-5.2-5.2c-2.8,0-5.2,2.3-5.2,5.2S119.2,53.7,122.1,53.7z'/%3E%3Ctext font-size='30' text-align='center' text-anchor='middle' stroke='none' font-family='Sans-serif, Helvetica, Arial'%3E%3Ctspan x='120' y='130'%3ENo image%3C/tspan%3E%3Ctspan x='120' y='160'%3Eavailable%3C/tspan%3E%3C/text%3E%3C/g%3E%3C/svg%3E";
        img.classList.add('c-image--fallback-nia');
        break;
      case "broken":
        img.classList.add('c-image--fallback-broken');
        break;
      default:
    }
    img.classList.add('c-image--fallback');
  }

  onLoadImage(event) {
    const img = event.target;
    var computedStyles = getComputedStyle(img);
    this.hasLoaded = true;
    img.classList.add('c-image--is-loaded');
  }
}

// Register the new element with the browser.
customElements.define('optimal-img', OptimalImg);
