import { OverlayConfig } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, Input, model, OnInit, Output, Renderer2, TemplateRef, viewChild } from '@angular/core';
import { OverlayDirective } from '../../shared/overlay';
import { Subscription } from 'rxjs';
import { CdkDragEnd, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'platinum-slide-modal',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './slide-modal.component.html',
  styleUrl: './slide-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [OverlayDirective]
})
export class SlideModalComponent implements OnInit{
  template = viewChild<TemplateRef<unknown> | undefined>('defaultTemplate');
  isOpen = model<boolean>()
  @Input() slideHeight: number = 300;
  @Input() closeTriggerHeight: number = 150;
  @Output() wasClosed = new EventEmitter<boolean>(); 
  private rd = inject(Renderer2);
  private overlay = inject(OverlayDirective);
  private subscription = new Subscription();
  
  /*aria attributes*/
  @Input() ariaLabel: string = 'slide up';
  @Input() ariaDescription: string = 'slide up description';

  constructor(){
    effect(() => {
      if(this.isOpen() === true ) this.initOverlay();
    })
  }

  ngOnInit(): void {
    this.subscription.add(
      this.overlay.backdropClicked$.subscribe(() => this.closeAll())
    );
  }
  
  /*resets translate value on Y axis, and resets to original height. */
  onDragEnd(event: CdkDragEnd, el: HTMLDivElement) : void {
    let currentHeight: number = parseInt(el.style.height);

    event.source._dragRef.reset();
    this.resetTransform(el);
    this.updateHeight(el, this.slideHeight);

    if(currentHeight < this.closeTriggerHeight) this.closeAll();
  }
  
  /*expands slideup height in equal measure of translate value and maintains translate origin on 0*/
  onDragMoved(event: CdkDragMove, el: HTMLDivElement): void {  
    this.resetTransform(el);
    let currentHeight = this.slideHeight - event.distance.y
    this.updateHeight(el, currentHeight);
  }
    
  private initOverlay(): void {
    this.overlay.init(this.template());
  }

  private updateHeight(el: HTMLDivElement, value: number): void {
    this.rd.setStyle(el, 'height', `${value}px`);   
  }

  private resetTransform(el: HTMLDivElement): void {
    this.rd.setStyle(el, 'transform', 'translate3d(0px, 0px, 0px)');
  }

  protected closeAll(): void {
    this.isOpen.set(false);
    this.wasClosed.emit(true);
    this.overlay.close();
  }  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
