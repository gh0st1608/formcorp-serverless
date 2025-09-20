output "dynamodb_table_names" {
  value = { for k, m in module.dynamodb : k => m.table_name }
}

output "table_arn" {
  value = aws_dynamodb_table.this.arn
}
