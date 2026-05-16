import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPrincipal } from '../../../domain/auth/auth.model';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPrincipal | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: AuthPrincipal }>();
    return request.user;
  },
);
