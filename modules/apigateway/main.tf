resource "aws_api_gateway_rest_api" "this" {
  name        = var.name
  description = "API for forms submission"
  tags        = var.tags
}

resource "aws_api_gateway_resource" "claim" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "claim"
}

resource "aws_api_gateway_method" "post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.claim.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_proxy" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.claim.id
  http_method             = aws_api_gateway_method.post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${var.aws_region}:lambda:path/2015-03-31/functions/${var.lambda_arn}/invocations"

}

resource "aws_lambda_permission" "forms_apgw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_name
  principal     = "apigateway.amazonaws.com"
  source_arn = "${aws_api_gateway_rest_api.this.execution_arn}/${var.aws_env}/POST/claim"

}

resource "aws_api_gateway_deployment" "this" {
  depends_on = [aws_api_gateway_integration.lambda_proxy]
  rest_api_id = aws_api_gateway_rest_api.this.id
  triggers = {
    redeploy = sha1(var.lambda_arn)
  }
  
  lifecycle {
    create_before_destroy = true
  }
}
