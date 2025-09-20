import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class HeadersGuard implements CanActivate {
    private readonly allowedDomains;
    canActivate(context: ExecutionContext): boolean;
}
