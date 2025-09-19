# Dummy Lambda source (un archivo mínimo para zippear)
resource "local_file" "dummy_lambda" {
  content  = <<-EOT
    exports.handler = async (event) => {
      console.log("Dummy Lambda invoked:", JSON.stringify(event));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from dummy lambda!" }),
      };
    };
  EOT
  filename = "${path.module}/../.build/${var.function_name}_index.js"
}

# Create zip with dummy
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = local_file.dummy_lambda.filename
  output_path = "${path.module}/../.build/${var.function_name}.zip"
}

# IAM assume role policy
data "aws_iam_policy_document" "assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "this" {
  name               = "${var.function_name}_role"
  assume_role_policy = data.aws_iam_policy_document.assume.json
  tags               = var.tags
}

resource "aws_iam_role_policy" "this_policy" {
  name = "${var.function_name}_policy"
  role = aws_iam_role.this.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_lambda_function" "this" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = var.function_name
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  role             = aws_iam_role.this.arn
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  timeout = 60

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
  }

  environment {
    variables = var.env_variables
  }

  tags = var.tags
}
