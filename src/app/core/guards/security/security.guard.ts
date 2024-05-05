import { CanActivateFn } from '@angular/router';
import { SessionService } from '../../services/security/session/session.service';
import { inject } from '@angular/core';

export const securityGuard: CanActivateFn = (route, state) => {
  const sessionService: SessionService = inject(SessionService);
  return !sessionService.isLogged();
};
