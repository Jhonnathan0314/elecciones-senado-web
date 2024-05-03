import { TestBed } from '@angular/core/testing';

import { SecretHeaderInterceptor } from './secret-header.interceptor';

describe('SecretHeaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SecretHeaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SecretHeaderInterceptor = TestBed.inject(SecretHeaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
