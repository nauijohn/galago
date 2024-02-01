import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly logger = new Logger('TimeoutInterceptor');

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('intercept...');

    const response = context.switchToHttp().getResponse();
    const timeout =
      this.reflector.get<number>('request-timeout', context.getHandler()) ||
      60000;
    response.setTimeout(timeout);

    return next.handle();
  }
}
