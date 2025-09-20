# DynamoDB module
module "dynamodb" {
  source   = "./modules/dynamodb"
  for_each = toset(var.dynamodb_tables)

  name = each.value
  tags = local.common_tags
}

# Lambda module
module "lambda" {
  source        = "./modules/lambda"
  function_name = "cargocom-claim-service"
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  source_dir    = var.lambda_source_dir
  env_variables = {
    CLAIM_TABLE         = module.dynamodb["claim"].table_name
    CLAIM_COUNTER_TABLE = module.dynamodb["claim_counter"].table_name
  }
  tags = local.common_tags
}

# API Gateway module (integrates with lambda)
module "api" {
  source      = "./modules/apigateway"
  name        = "forms-api"
  aws_region  = var.aws_region
  aws_env     = var.aws_env
  lambda_arn  = module.lambda.lambda_arn
  lambda_name = module.lambda.function_name
  tags        = local.common_tags
}

# Site (S3 + CloudFront)
module "site" {
  source          = "./modules/site"
  fqdn            = local.fqdn
  certificate_arn = var.certificate_arn
  aliases         = var.aliases
  tags            = local.common_tags
}

module "iam" {
  source = "./modules/iam"
}

module "codebuild" {
  source                     = "./modules/codebuild"
  repository                 = var.repository_form
  codebuild_service_role_arn = module.iam.codebuild_service_role_arn
}

module "s3" {
  source = "./modules/s3"
}
