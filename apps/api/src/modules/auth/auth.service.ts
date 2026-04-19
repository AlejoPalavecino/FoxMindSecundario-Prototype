import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { compare, hash } from "bcryptjs";
import type { SignOptions } from "jsonwebtoken";
import type { AuthSession, SessionUser } from "@foxmind/shared";
import { PrismaService } from "../prisma/prisma.service";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./auth.constants";
import type { JwtPayload } from "./interfaces/jwt-payload.interface";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Credenciales inválidas");
    }
    return this.issueSession(this.toPayload(user));
  }

  async refresh(dto: RefreshDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException("No existe sesión activa");
    }
    const matches = await compare(dto.refreshToken, user.refreshTokenHash);
    if (!matches) {
      throw new UnauthorizedException("Refresh token inválido");
    }
    return this.issueSession(this.toPayload(user));
  }

  async me(payload: JwtPayload) {
    return this.toSessionUser(payload);
  }

  private async issueSession(payload: JwtPayload): Promise<AuthSession> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, ACCESS_TOKEN, "15m"),
      this.signToken(payload, REFRESH_TOKEN, "7d")
    ]);
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { refreshTokenHash: await hash(refreshToken, 10) }
    });
    return {
      user: this.toSessionUser(payload),
      tokens: { accessToken, refreshToken }
    };
  }

  private async verifyRefreshToken(token: string) {
    const secret = this.configService.getOrThrow<string>(REFRESH_TOKEN);
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
    } catch {
      throw new UnauthorizedException("Refresh token inválido o expirado");
    }
  }

  private signToken(
    payload: JwtPayload,
    secretKey: string,
    expiresIn: SignOptions["expiresIn"]
  ) {
    const secret = this.configService.getOrThrow<string>(secretKey);
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }

  private toPayload(user: {
    id: string;
    email: string;
    role: "DOCENTE" | "ALUMNO";
    tenantId: string;
  }): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    };
  }

  private toSessionUser(payload: JwtPayload): SessionUser {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId
    };
  }
}
