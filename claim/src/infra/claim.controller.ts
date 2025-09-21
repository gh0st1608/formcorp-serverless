import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Headers,
  HttpCode,
  Req,
} from "@nestjs/common";
import { RequestClaimDTO } from "../application/dto/create-claim.dto";
import { ClaimApplication } from "../application/claim.application";
import { HeadersGuard } from "./claim.validator";

@Controller("claims")
@UseGuards(HeadersGuard)
export class ClaimController {
  constructor(private readonly createClaim: ClaimApplication) {}

  @Post("register")
  async create(@Body() dto: RequestClaimDTO, @Req() req: Request) {
    const domain = (req as any).clientDomain;
    return this.createClaim.save(dto, domain);
  }
}
