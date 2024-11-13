import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/utils/spinner/spinner.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent {

  loading: boolean = false;

  spinnerSubscription: Subscription;

  constructor(private spinnerService: SpinnerService) { }

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
      }
    })
  }

}
