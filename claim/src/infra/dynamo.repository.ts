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

    this.docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        convertClassInstanceToMap: true, // 👈 clave para soportar instancias de clase
      },
    });
  }

  async save(claim: Claim): Promise<Claim> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: claim, // 👈 puedes pasar la instancia de Claim directamente
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

    // Dynamo devuelve un objeto plano, así que reconstruimos la entidad Claim
    return new Claim(
      result.Item.id,
      result.Item.firstName,
      result.Item.lastName,
      result.Item.email,
      result.Item.caseDescription,
      result.Item.domain,
      result.Item.requestType,
      result.Item.trackingCode,
      result.Item.createdAt,
      result.Item.authorizeData,
      result.Item.guardianData,
      result.Item.contractedGoodDetail,
      result.Item.incidentDetail,
      result.Item.address,
      result.Item.requestDate,
      result.Item.underAge,
      result.Item.documentNumber,
      result.Item.orderNumber,
      result.Item.providerName,
      result.Item.customerOrder,
      result.Item.addressReference,
      result.Item.phone,
      result.Item.contractedGoodType,
    );
  }

  async getNextCorrelativo(domain: Domain, tipo: 'Q' | 'R'): Promise<number> {
    const params = {
      TableName: this.counterTable,
      Key: { id: `${domain}#${tipo}` },
      UpdateExpression:
        'SET lastCorrelative = if_not_exists(lastCorrelative, :start) + :inc',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':start': 0,
      },
      ReturnValues: 'UPDATED_NEW' as const,
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
