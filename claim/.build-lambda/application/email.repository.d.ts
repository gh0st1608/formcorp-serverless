export declare const IEmailRepositorySymbol: unique symbol;
export interface IEmailRepository {
    sendEmail(to: string, subject: string, body: string): Promise<void>;
}
