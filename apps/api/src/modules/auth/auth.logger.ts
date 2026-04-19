import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AuthLogger {
  private readonly logger = new Logger("Auth");

  info(event: string, metadata: Record<string, unknown>) {
    this.logger.log(JSON.stringify({ event, ...metadata }));
  }

  warn(event: string, metadata: Record<string, unknown>) {
    this.logger.warn(JSON.stringify({ event, ...metadata }));
  }
}
