import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInUserDTO, SignUpUserDTO } from './authentication.dto';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  async signUp(@Body() signUpUserDto: SignUpUserDTO) {
    return await this.authenticationService.signUp(signUpUserDto);
  }

  @Post('sign-in')
  async signIn(@Res() res: Response, @Body() signInUserDto: SignInUserDTO) {
    const {
      data: { accessToken, refreshToken },
      status,
      message,
    } = await this.authenticationService.signIn(signInUserDto);
    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken);

    return res.status(200).json({
      status,
      message,
    });
  }
}
