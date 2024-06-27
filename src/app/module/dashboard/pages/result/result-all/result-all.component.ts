import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Result } from 'src/app/core/models/results.model';
import { ResultService } from 'src/app/core/services/results/result/result.service';

@Component({
  selector: 'app-result-all',
  templateUrl: './result-all.component.html',
  styleUrls: ['./result-all.component.scss']
})
export class ResultAllComponent implements OnInit, OnDestroy {

  results: Result[] = [];

  resultSubscription: Subscription;

  hasServerError: boolean = false;

  constructor(
    private router: Router,
    private resultService: ResultService
  ) { }

  ngOnInit(): void {
    this.openResultSubscription();
  }

  ngOnDestroy(): void {
      this.resultSubscription.unsubscribe();
  }

  openResultSubscription() {
    this.resultSubscription = this.resultService.results$.subscribe({
      next: (results) => this.results = results,
      error: (error) => this.hasServerError = true
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/user/update/${id}`);
  }

  delete(id: number) {
    this.resultService.deleteById(id).subscribe({
      error: (error) => this.hasServerError = true
    })
  }

}
