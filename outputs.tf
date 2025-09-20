output "cloudfront_domain" {
  value       = module.site.cloudfront_domain
  description = "CloudFront distribution domain"
}

output "site_fqdn" {
  value       = module.site.fqdn
  description = "FQDN (subdomain) for the site; configure DNS to point to CloudFront"
}

output "api_invoke_url" {
  value       = module.api.invoke_url
  description = "API Gateway invoke base URL (stage prod)"
}

output "dynamodb_table_names" {
  value = { for k, m in module.dynamodb : k => m.table_name }
}

output "dynamodb_table_arns" {
  value = { for k, m in module.dynamodb : k => m.table_arn }
}

output "lambda_function_name" {
  value = module.lambda.function_name
}

output "lambda_function_arn" {
  value = module.lambda.lambda_arn
}
