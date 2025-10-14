import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthService } from './auth.service';

class AuthDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;
}

class TokenResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user/register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, type: TokenResponse })
  async registerUser(@Body() { email, password, name }: AuthDto) {
    return this.authService.registerUser(email, password, name);
  }

  @Post('user/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: TokenResponse })
  async loginUser(@Body() { email, password }: AuthDto) {
    return this.authService.loginUser(email, password);
  }

  @Post('admin/register')
  @ApiOperation({ summary: 'Register new admin' })
  @ApiResponse({ status: 201, type: TokenResponse })
  async registerAdmin(@Body() { email, password, name }: AuthDto) {
    return this.authService.registerAdmin(email, password, name);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, type: TokenResponse })
  async loginAdmin(@Body() { email, password }: AuthDto) {
    return this.authService.loginAdmin(email, password);
  }
}