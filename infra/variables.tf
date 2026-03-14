variable "account_id" {
  description = "Cloudflare account ID"
  type        = string
  sensitive   = true
}

variable "zone_id" {
  description = "Cloudflare zone ID for mostly-hallucinations.com"
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "Apex domain name"
  type        = string
  default     = "mostly-hallucinations.com"
}

variable "origin_hostname" {
  description = "AEM EDS origin hostname"
  type        = string
  default     = "main--grounded--benpeter.aem.live"
}
