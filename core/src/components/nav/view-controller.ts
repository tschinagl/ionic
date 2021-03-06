
import { NavOptions, ViewState } from './nav-util';
import { NavControllerBase } from './nav';
import { assert } from '../../utils/helpers';
import { FrameworkDelegate } from '../..';

/**
 * @name ViewController
 * @description
 * Access various features and information about the current view.
 * @usage
 *  ```ts
 * import { Component } from '@angular/core';
 * import { ViewController } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage{
 *
 *   constructor(public viewCtrl: ViewController) {}
 *
 * }
 * ```
 */
export class ViewController {

  private _cntDir: any;
  private _leavingOpts: NavOptions;

  _nav: NavControllerBase;
  _state: ViewState = ViewState.New;

  /** @hidden */
  id: string;
  element: HTMLElement;
  delegate: FrameworkDelegate;

  constructor(
    public component: any,
    public data: any
  ) {}

  /**
   * @hidden
   */
  init(container: HTMLElement) {
    this._state = ViewState.Attached;

    const component = this.component;
    if (this.delegate) {
      return this.delegate.attachViewToDom(container, component, this.data, ['ion-page', 'hide-page']).then(el => {
        this.element = el;
      });
    }
    const element = (this.element)
      ? this.element
      : typeof component === 'string'
      ? document.createElement(component)
      : component;

    element.classList.add('ion-page');
    element.classList.add('hide-page');

    if (this.data) {
      Object.assign(element, this.data);
    }
    container.appendChild(element);
    this.element = element;
    return Promise.resolve();
  }

  _setNav(navCtrl: NavControllerBase) {
    this._nav = navCtrl;
  }

  /**
   * @hidden
   */
  getNav(): NavControllerBase {
    return this._nav;
  }

  /**
   * @hidden
   */
  getTransitionName(_direction: string): string {
    return this._nav && this._nav.config && this._nav.config.get('pageTransition') || 'md';
  }

  /**
   * @hidden
   */
  setLeavingOpts(opts: NavOptions) {
    this._leavingOpts = opts;
  }

  /**
   * @hidden
   * DOM WRITE
   */
  _destroy() {
    assert(this._state !== ViewState.Destroyed, 'view state must be ATTACHED');

    const element = this.element;
    if (element) {
      if (this.delegate) {
        this.delegate.removeViewFromDom(element.parentElement, element);
      } else {
        element.remove();
      }
    }
    this._nav = this._cntDir = this._leavingOpts = null;
    this._state = ViewState.Destroyed;
  }

  /**
   * Get the index of the current component in the current navigation stack.
   * @returns {number} Returns the index of this page within its `NavController`.
   */
  get index(): number {
    return (this._nav ? this._nav.indexOf(this) : -1);
  }
}

export function isViewController(viewCtrl: any): viewCtrl is ViewController {
  return viewCtrl instanceof ViewController;
}
