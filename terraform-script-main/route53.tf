resource "aws_route53_record" "www" {
  zone_id = var.deploy_domain_id
  name    = "www"
  type    = "A"
  ttl     = 60
  records = [aws_instance.ec2_instance_1.public_ip]
}

resource "aws_route53_record" "root" {
  zone_id = var.deploy_domain_id
  name    = ""
  type    = "A"
  ttl     = 60
  records = [aws_instance.ec2_instance_1.public_ip]
}