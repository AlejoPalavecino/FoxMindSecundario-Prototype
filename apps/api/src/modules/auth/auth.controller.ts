import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { Public } from "./decorators/public.decorator";
import { Roles } from "./decorators/roles.decorator";
import type { JwtPayload } from "./interfaces/jwt-payload.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post("refresh")
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }

  @Get("me")
  @Roles("DOCENTE", "ALUMNO")
  me(@Req() request: { user: JwtPayload }) {
    return this.authService.me(request.user);
  }
}
