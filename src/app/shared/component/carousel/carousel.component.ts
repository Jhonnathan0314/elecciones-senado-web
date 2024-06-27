import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Party } from 'src/app/core/models/results.model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {

  @ViewChild("carouselContainer") carouselContainer: ElementRef;

  @Input() parties: Party[] = [];
  @Input() hasServerError: boolean = false;

  @Output() updateClick = new EventEmitter<number>();
  @Output() deleteClick = new EventEmitter<number>();

  movePixel = 325;

  constructor() { }

  update(id: number) {
    this.updateClick.emit(id);
  }

  delete(id: number) {
    this.deleteClick.emit(id);
  }

  move_left(): void {
    this.carouselContainer.nativeElement.scrollLeft -= this.movePixel;
    if (this.carouselContainer.nativeElement.scrollLeft <= 0) {
      this.carouselContainer.nativeElement.scrollLeft = this.carouselContainer.nativeElement.scrollWidth - this.carouselContainer.nativeElement.clientWidth;
    }
  }

  move_right():void {
    let maxScrollLeft = this.carouselContainer.nativeElement.scrollWidth - this.carouselContainer.nativeElement.clientWidth;
    this.carouselContainer.nativeElement.scrollLeft += this.movePixel;
    if (this.carouselContainer.nativeElement.scrollLeft >= maxScrollLeft) {
      this.carouselContainer.nativeElement.scrollLeft = 0;
    }
  }

}
