# DynamoDB module
module "dynamodb" {
  source       = "./modules/dynamodb"
  name         = "forms_table"
  tags         = local.common_tags
}

# Lambda module
module "lambda" {
  source        = "./modules/lambda"
  function_name = "forms-submit"
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  source_dir    = var.lambda_source_dir
  env_variables = {
    TABLE_NAME = module.dynamodb.table_name
  }
  tags = local.common_tags
}

# API Gateway module (integrates with lambda)
module "api" {
  source         = "./modules/apigateway"
  name           = "forms-api"
  aws_region     = var.aws_region
  aws_env        = var.aws_env
  lambda_arn     = module.lambda.lambda_arn
  lambda_name    = module.lambda.function_name
  tags           = local.common_tags
}

# Site (S3 + CloudFront)
module "site" {
  source          = "./modules/site"
  fqdn            = local.fqdn
  certificate_arn = var.certificate_arn
  tags            = local.common_tags
}
