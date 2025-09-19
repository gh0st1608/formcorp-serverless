output "cloudfront_domain" {
  value = aws_cloudfront_distribution.this.domain_name
}

output "fqdn" {
  value = var.fqdn
}
