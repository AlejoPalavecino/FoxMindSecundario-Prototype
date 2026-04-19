import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { ACCESS_TOKEN, IS_PUBLIC_KEY } from "../auth.constants";
import type { JwtPayload } from "../interfaces/jwt-payload.interface";

type RequestWithUser = {
  headers: { authorization?: string };
  user?: JwtPayload;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractBearerToken(request);
    const secret = this.configService.getOrThrow<string>(ACCESS_TOKEN);
    try {
      request.user = await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
      return true;
    } catch {
      throw new UnauthorizedException("Token de acceso inválido o expirado");
    }
  }

  private extractBearerToken(request: RequestWithUser) {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException("Falta header de autorización");
    }
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Formato de token inválido");
    }
    return token;
  }
}
