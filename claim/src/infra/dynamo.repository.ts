import { IClaimRepository } from '../domain/claim.repository';
import { Claim } from '../domain/claim.entity';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Domain } from '../domain/enum';

export class DynamoClaimRepository implements IClaimRepository {
  private readonly tableName = process.env.CLAIMS_TABLE || 'Claim';
  private readonly counterTable = process.env.COUNTER_TABLE || 'ClaimCounters';
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async save(claim: Claim): Promise<Claim> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        id: claim.id,
        name: claim.name,
        lastname: claim.lastname,
        email: claim.email,
        caseDescription: claim.caseDescription,
        tipoSolicitud: claim.tipo,
        domain: claim.domain,
        codSeguimiento: claim.codigoSeguimiento,
        createdAt: claim.createdAt,
      },
    });

    await this.docClient.send(command);
    return claim;
  }

  async findById(id: string): Promise<Claim | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    });

    const result = await this.docClient.send(command);

    if (!result.Item) return null;

    return new Claim(
      result.Item.id,
      result.Item.name,
      result.Item.lastname,
      result.Item.email,
      result.Item.caseDescription,
      result.Item.tipoSolicitud,
      result.Item.domain,
      result.Item.codSeguimiento,
      result.Item.createdAt,
    );
  }

  async getNextCorrelativo(domain: Domain, tipo: 'Q' | 'R'): Promise<number> {
    const params = {
      TableName: this.counterTable,
      Key: { domain, tipo },
      UpdateExpression:
        'SET lastCorrelative = if_not_exists(lastCorrelative, :start) + :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':start': 0,
      },
      ReturnValues: 'UPDATED_NEW' as const, // <- 'as const' fija el literal para TypeScript
    };

    const result = await this.docClient.send(new UpdateCommand(params));

    if (
      !result.Attributes ||
      typeof result.Attributes.lastCorrelative !== 'number'
    ) {
      throw new Error(`Failed to generate correlativo for ${domain}-${tipo}`);
    }

    return result.Attributes.lastCorrelative;
  }
}
