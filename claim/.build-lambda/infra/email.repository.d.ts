import { IEmailRepository } from '../application/email.repository';
export declare class EmailRepositoryImpl implements IEmailRepository {
    private transporter;
    constructor();
    sendEmail(to: string, subject: string, body: string): Promise<void>;
}
