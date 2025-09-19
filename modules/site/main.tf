resource "aws_s3_bucket" "site" {
  bucket = replace(var.fqdn, ".", "-")
  acl    = "private"
  tags   = var.tags
}

resource "aws_s3_bucket_object" "index_html" {
  bucket = aws_s3_bucket.site.id
  key    = "index.html"
  content = <<-HTML
    <!doctype html>
    <html>
      <head><meta charset="utf-8"><title>${var.fqdn}</title></head>
      <body><h1>Placeholder for ${var.fqdn}</h1></body>
    </html>
  HTML
  content_type = "text/html"
  acl          = "private"
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.fqdn}"
}

resource "aws_s3_bucket_policy" "policy" {
  bucket = aws_s3_bucket.site.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCFRead"
        Effect = "Allow"
        Principal = {
          CanonicalUser = aws_cloudfront_origin_access_identity.oai.s3_canonical_user_id
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.site.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = [var.fqdn]

  origin {
    origin_id   = "s3-${aws_s3_bucket.site.id}"
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-${aws_s3_bucket.site.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = var.tags

  depends_on = [
    aws_s3_bucket_object.index_html,
    aws_s3_bucket_policy.policy
  ]
}

