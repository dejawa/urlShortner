resource "aws_globalaccelerator_accelerator" "shortner" {
  name            = "shortner"
  ip_address_type = "IPV4"
  enabled         = true

}

resource "aws_globalaccelerator_endpoint_group" "shortner" {
  listener_arn = aws_globalaccelerator_listener.shortner.id

  endpoint_configuration {
    endpoint_id = aws_lb.nodeport_service.arn
    weight      = 100
  }
}


resource "aws_globalaccelerator_listener" "shortner" {
  accelerator_arn = aws_globalaccelerator_accelerator.shortner.id
  client_affinity = "SOURCE_IP"
  protocol        = "TCP"

  port_range {
    from_port = 80
    to_port   = 80
  }
}