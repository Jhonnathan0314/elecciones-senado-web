import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Party } from 'src/app/core/models/results.model';
import { PartyService } from 'src/app/core/services/results/party/party.service';

@Component({
  selector: 'app-party-all',
  templateUrl: './party-all.component.html',
  styleUrls: ['./party-all.component.scss']
})
export class PartyAllComponent implements OnInit, OnDestroy {

  parties: Party[] = [];

  partySubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private partyService: PartyService
  ) { }

  ngOnInit(): void {
    this.openPartySubscription();
  }

  ngOnDestroy(): void {
      this.partySubscription.unsubscribe();
  }

  openPartySubscription() {
    this.partySubscription = this.partyService.parties$.subscribe({
      next: (parties) => this.parties = parties,
      error: (error) => this.hasServerError = true
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/party/update/${id}`);
  }

  delete(id: number) {
    this.partyService.deleteById(id).subscribe({
      error: (error) => this.hasServerError = true
    })
  }

}
