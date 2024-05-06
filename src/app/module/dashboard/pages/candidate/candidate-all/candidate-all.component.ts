import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/core/models/results.model';
import { CandidateService } from 'src/app/core/services/results/candidate/candidate.service';

@Component({
  selector: 'app-candidate-all',
  templateUrl: './candidate-all.component.html',
  styleUrls: ['./candidate-all.component.scss']
})
export class CandidateAllComponent implements OnInit {

  candidates: Candidate[] = [];

  constructor(
    private router: Router,
    private candidateService: CandidateService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.candidateService.findAll().subscribe({
      next: (response) => {
        this.candidates = response.data;
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/candidate/update/${id}`);
  }

  delete(id: number) {
    this.candidateService.deleteById(id).subscribe({
      next: (response) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

}
