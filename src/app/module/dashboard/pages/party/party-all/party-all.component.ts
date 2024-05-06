import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Party } from 'src/app/core/models/results.model';
import { PartyService } from 'src/app/core/services/results/party/party.service';

@Component({
  selector: 'app-party-all',
  templateUrl: './party-all.component.html',
  styleUrls: ['./party-all.component.scss']
})
export class PartyAllComponent implements OnInit {

  @ViewChild("carouselContainer") carouselContainer: ElementRef;

  parties: Party[] = [];

  movePixel = 650;

  constructor(
    private router: Router,
    private partyService: PartyService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.partyService.findAll().subscribe({
      next: (response) => {
        this.parties = response.data;
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/party/update/${id}`);
  }

  delete(id: number) {
    this.partyService.deleteById(id).subscribe({
      next: (response) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
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
