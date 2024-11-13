import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/utils/spinner/spinner.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  loading: boolean = false;

  spinnerSubscription: Subscription;

  constructor(private spinnerService: SpinnerService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initSpinnerSub();
  }

  ngOnDestroy(): void {
      this.spinnerSubscription.unsubscribe();
  }

  initSpinnerSub() {
    this.spinnerSubscription = this.spinnerService.spinner$.subscribe({
      next: (state) => {
        this.loading = state;
        this.cdr.detectChanges();
      }
    })
  }

}
