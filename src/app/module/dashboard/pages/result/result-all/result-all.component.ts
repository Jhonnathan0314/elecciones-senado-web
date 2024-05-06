import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/core/models/results.model';
import { ResultService } from 'src/app/core/services/results/result/result.service';

@Component({
  selector: 'app-result-all',
  templateUrl: './result-all.component.html',
  styleUrls: ['./result-all.component.scss']
})
export class ResultAllComponent implements OnInit {

  results: Result[] = [];

  constructor(
    private router: Router,
    private resultService: ResultService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.resultService.findAll().subscribe({
      next: (response) => {
        this.results = response.data;
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/user/update/${id}`);
  }

  delete(id: number) {
    this.resultService.deleteById(id).subscribe({
      next: (response) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

}
