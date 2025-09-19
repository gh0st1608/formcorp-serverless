locals {
  fqdn        = "${var.subdomain}.${var.domain_name}"
  common_tags = merge({
    Project     = "forms-serverless"
    Environment = "dev"
    Owner       = "erick"
  }, var.tags)
}
