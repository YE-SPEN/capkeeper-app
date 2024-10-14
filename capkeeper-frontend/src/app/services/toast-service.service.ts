import { Injectable, ApplicationRef, Injector, createComponent } from '@angular/core';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  showToast(message: string, isSuccessful: boolean): void {
    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.appRef.injector
    });
    
    componentRef.instance.message = message;
    componentRef.instance.isSuccessful = isSuccessful;

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    setTimeout(() => {
      this.dismissToast(componentRef, domElem);
    }, 4500);
  }

  dismissToast(componentRef: any, domElem: HTMLElement): void {
    this.appRef.detachView(componentRef.hostView);
    domElem.remove();
  }
}
