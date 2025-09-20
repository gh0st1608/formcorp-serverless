export const IEmailRepositorySymbol = Symbol('IEmailRepository');

export interface IEmailRepository {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}