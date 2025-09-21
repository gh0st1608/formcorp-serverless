import { CanActivate, ExecutionContext, Injectable, BadRequestException } from "@nestjs/common";
import { Domain } from "../domain/enum";

@Injectable()
export class HeadersGuard implements CanActivate {
  // Permitidos usando enum
  private readonly allowedDomains = Object.values(Domain);

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (req.method === "OPTIONS") return true;
    
    const channel = req.headers["channel"] || req.headers["Channel"];
    const apiKey = req.headers["x-api-key"] || req.headers["X-Api-Key"];
    if (!channel || !apiKey) {
      throw new BadRequestException("Missing required headers: channel or x-api-key");
    }

    if (!["APP", "WEB", "OIT"].includes(String(channel))) {
      throw new BadRequestException("Invalid channel header");
    }

    const domainCandidates = [
      req.headers["x-client-domain"], // si React lo envía
      req.headers["x-forwarded-host"], // si CloudFront lo reenvía
      req.headers["host"],             // fallback
    ].filter(Boolean);

    const domain = String(domainCandidates[0] || "").trim();
    if (!domain) {
      throw new BadRequestException("Cannot detect domain from request");
    }

    // Validación usando enum
    if (!this.allowedDomains.includes(domain as Domain)) {
      throw new BadRequestException(`Domain not allowed: ${domain}`);
    }

    // Guardar en request para el controller
    (req as any).clientDomain = domain as Domain;

    return true;
  }
}
