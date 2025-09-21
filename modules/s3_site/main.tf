module "this" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.1.2"

  bucket = "${var.fqdn}-site"
  acl    = "private"

  control_object_ownership = true
  object_ownership         = "ObjectWriter"

  versioning = {
    enabled = true
  }

  website = null

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  tags = var.tags
}
