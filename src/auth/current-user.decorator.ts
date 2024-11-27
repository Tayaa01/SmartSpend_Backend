// src/auth/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to extract the current user from the request
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;  // The user object set by the JWT strategy
  },
);
