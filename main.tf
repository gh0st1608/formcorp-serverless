# DynamoDB
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
    CLAIMS_TABLE  = module.dynamodb["claim"].table_name
    COUNTER_TABLE = module.dynamodb["claim_counter"].table_name
    SMTP_FROM     = var.smtp_from
    SMTP_HOST     = var.smtp_host
    SMTP_PASS     = var.smtp_pass
    SMTP_PORT     = var.smtp_port
    SMTP_USER     = var.smtp_user
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

  bucket_id                   = module.s3_site.bucket_id
  bucket_arn                  = module.s3_site.bucket_arn
  bucket_regional_domain_name = module.s3_site.bucket_regional_domain_name
}


module "iam" {
  source = "./modules/iam"
}

module "codebuild" {
  source                     = "./modules/codebuild"
  repository                 = var.repository_form
  codebuild_service_role_arn = module.iam.codebuild_service_role_arn
}

module "s3_design" {
  source = "./modules/s3_design"
}

module "s3_site" {
  source = "./modules/s3_site"
  fqdn   = local.fqdn
  tags   = local.common_tags
}
