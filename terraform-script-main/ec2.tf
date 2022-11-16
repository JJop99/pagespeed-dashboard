# Create the Network Interface 
resource "aws_network_interface" "network_interface_1" {
  subnet_id       = aws_subnet.public_subnets[0].id
  security_groups = [aws_security_group.allow_ssh.id, aws_security_group.allow_http.id]
}

# Keypair for SSH connection
resource "aws_key_pair" "ec2_ssh_key" {
  key_name   = var.keypair.key_name
  public_key = var.keypair.public_key
}

# Launch the EC2 Instance
resource "aws_instance" "ec2_instance_1" {
  ami           = "ami-070b208e993b59cea"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.ec2_ssh_key.key_name


  network_interface {
    network_interface_id = aws_network_interface.network_interface_1.id
    device_index         = 0
  }

  user_data = <<-EOL
  #!/bin/bash -xe

  echo "docker ps -aq | xargs docker stop | xargs docker rm && bash /var/lib/cloud/instances/*/scripts/part-001" > /root/docker-script.sh
  yum install docker -y
  docker login ${var.docker_registry.registry} --username ${var.docker_registry.username} --password ${var.docker_registry.password}
  systemctl enable docker.service
  systemctl start docker.service
  docker pull ${var.docker_registry.image}
  docker run -d -p 80:80 ${var.docker_registry.image}

  EOL
}
