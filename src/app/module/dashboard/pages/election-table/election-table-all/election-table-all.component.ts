import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectionTable } from 'src/app/core/models/results.model';
import { ElectionTableService } from 'src/app/core/services/results/election-table/election-table.service';

@Component({
  selector: 'app-election-table-all',
  templateUrl: './election-table-all.component.html',
  styleUrls: ['./election-table-all.component.scss']
})
export class ElectionTableAllComponent implements OnInit {

  electionTables: ElectionTable[] = [];

  constructor(
    private router: Router,
    private electionTableService: ElectionTableService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.electionTableService.findAll().subscribe({
      next: (response) => {
        this.electionTables = response.data;
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

  update(id: number) {
    this.router.navigateByUrl(`/dashboard/election-table/update/${id}`);
  }

  delete(id: number) {
    this.electionTableService.deleteById(id).subscribe({
      next: (response) => {
        this.ngOnInit();
      },
      error: (error) => {
        console.log("Error: ", error.statusText);
      }
    })
  }

}
