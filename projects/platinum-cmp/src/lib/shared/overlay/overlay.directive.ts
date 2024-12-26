import { Directive, inject, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { GlobalPositionStrategy, Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { Subject, Subscription } from 'rxjs';

@Directive({
  selector: '[platinum-overlay]',
  standalone: true
})
export class OverlayDirective implements OnDestroy {
  private templatePortal?: TemplatePortal<any>;
  private positionStrategy?: PositionStrategy;
  private subscription = new Subscription();
  private vcr = inject(ViewContainerRef);
  private overlay = inject(Overlay);
  private overlayRef!: OverlayRef;

  public backdropClicked$ = new Subject<boolean>();
  

  public init(template?: TemplateRef<unknown>) : void {
    this.templatePortal = this.createTemplatePortal(template);

    this.positionStrategy = this.createPositionStrategy();
    
    this.overlayRef = this.createOverlay();

    this.overlayRef.attach(this.templatePortal);
  
    this.subscription.add(
      this.overlayRef.backdropClick().subscribe(() => {
        this.backdropClicked$.next(true);  
        this.close();
      })
    );
  }

  private createOverlay(): OverlayRef {
    if( ! this.overlay ) throw new Error("Overlay cdk service couldn't be injected.");

    return this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.positionStrategy
    });
  }
  

  private createTemplatePortal(template?: TemplateRef<unknown>): TemplatePortal {
    if( ! template ) throw new Error("Template ref was not found. Overlay couldn't be created.");

    return new TemplatePortal(template!, this.vcr);
  }
  

  private createPositionStrategy() : GlobalPositionStrategy {
    if( ! this.overlay ) throw new Error("Overlay cdk service couldn't be injected.");

    return this.overlay.position().global().centerHorizontally().centerVertically();
  }
  

  public close(): void {
    if( !this.overlayRef ) { console.warn("overlay ref not found"); return; } 
    
    this.overlayRef.dispose();
  }

  ngOnDestroy(): void {
    this.overlayRef.detach();
    this.subscription.unsubscribe(); 
  }

}
