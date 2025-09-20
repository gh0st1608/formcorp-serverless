"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoClaimRepository = void 0;
const claim_entity_1 = require("../domain/claim.entity");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoClaimRepository {
    constructor() {
        this.tableName = process.env.CLAIMS_TABLE || 'Claim';
        this.counterTable = process.env.COUNTER_TABLE || 'ClaimCounters';
        const client = new client_dynamodb_1.DynamoDBClient({
            region: process.env.AWS_REGION || 'us-east-1',
        });
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
    }
    async save(claim) {
        const command = new lib_dynamodb_1.PutCommand({
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
    async findById(id) {
        const command = new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { id },
        });
        const result = await this.docClient.send(command);
        if (!result.Item)
            return null;
        return new claim_entity_1.Claim(result.Item.id, result.Item.name, result.Item.lastname, result.Item.email, result.Item.caseDescription, result.Item.tipoSolicitud, result.Item.domain, result.Item.codSeguimiento, result.Item.createdAt);
    }
    async getNextCorrelativo(domain, tipo) {
        const params = {
            TableName: this.counterTable,
            Key: { id: `${domain}#${tipo}` },
            UpdateExpression: 'SET lastCorrelative = if_not_exists(lastCorrelative, :start) + :inc',
            ExpressionAttributeValues: {
                ':inc': 1,
                ':start': 0,
            },
            ReturnValues: 'UPDATED_NEW',
        };
        const result = await this.docClient.send(new lib_dynamodb_1.UpdateCommand(params));
        if (!result.Attributes ||
            typeof result.Attributes.lastCorrelative !== 'number') {
            throw new Error(`Failed to generate correlativo for ${domain}-${tipo}`);
        }
        return result.Attributes.lastCorrelative;
    }
}
exports.DynamoClaimRepository = DynamoClaimRepository;
//# sourceMappingURL=dynamo.repository.js.map