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

  parties: Party[] = [];

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

}
