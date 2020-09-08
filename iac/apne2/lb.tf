#LB / TG / Listener
resource "aws_lb" "nodeport_service" {
  for_each                         = var.nodeport_service_map
  name                             = join("-", list(var.env, var.mno, each.key))
  load_balancer_type               = "network"
  enable_cross_zone_load_balancing = "true"

  dynamic "subnet_mapping" {
    for_each = data.terraform_remote_state.eip.outputs.fixed_nlb_eip_map[each.key]

    content {
      subnet_id     = module.vpc.public_subnets[subnet_mapping.key]
      allocation_id = subnet_mapping.value
    }
  }
}

resource "aws_alb_listener" "nodeport_service" {
  for_each          = var.nodeport_map
  load_balancer_arn = aws_lb.nodeport_service[var.nodeport_map[each.key].service].arn

  port     = var.nodeport_map[each.key].lb_port
  protocol = "TCP"
  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.nodeport_service[each.key].arn
  }

}

resource "aws_alb_target_group" "nodeport_service" {
  for_each = var.nodeport_map
  name     = join("-", list(var.env, var.mno, each.key))
  port     = var.nodeport_map[each.key].node_port
  protocol = "TCP"
  vpc_id   = module.vpc.vpc_id

  health_check {
    interval            = 30
    port                = var.nodeport_map[each.key].health_port
    protocol            = "TCP"
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }
}