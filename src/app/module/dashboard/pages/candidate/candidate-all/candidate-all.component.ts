import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Candidate } from 'src/app/core/models/results.model';
import { CandidateService } from 'src/app/core/services/results/candidate/candidate.service';

@Component({
  selector: 'app-candidate-all',
  templateUrl: './candidate-all.component.html',
  styleUrls: ['./candidate-all.component.scss']
})
export class CandidateAllComponent implements OnInit, OnDestroy {

  candidates: Candidate[] = [];

  candidateSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private candidateService: CandidateService
  ) { }

  ngOnInit(): void {
    this.openCandidateSubscription();
  }

  ngOnDestroy(): void {
    this.candidateSubscription.unsubscribe();
  }

  openCandidateSubscription() {
    this.candidateSubscription = this.candidateService.candidates$.subscribe({
      next: (candidates) => this.candidates = candidates,
      error: (error) => this.hasServerError = true
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/candidate/update/${id}`);
  }

  delete(id: number) {
    this.candidateService.deleteById(id).subscribe({
      error: (error) => this.hasServerError = true
    })
  }

}
