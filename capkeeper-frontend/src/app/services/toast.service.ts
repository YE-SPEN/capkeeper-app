import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  showToast(message: string, toastElement: HTMLElement): void {
    const messageContainer = toastElement.querySelector('.toast-message');
    if (messageContainer) {
      this.renderer.setProperty(messageContainer, 'textContent', message);
    }
    
    this.renderer.addClass(toastElement, 'show');
    this.renderer.removeClass(toastElement, 'hidden');

    setTimeout(() => {
      this.dismissToast(toastElement);
    }, 3500);
  }

  dismissToast(toastElement: HTMLElement): void {
    if (toastElement) {
      this.renderer.removeClass(toastElement, 'show');
      this.renderer.addClass(toastElement, 'hidden');
    }
  }
}
