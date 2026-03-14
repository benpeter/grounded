# ---------------------------------------------------------------------------
# DNS
# ---------------------------------------------------------------------------

# Apex domain — Cloudflare CNAME-flattens automatically at the root
resource "cloudflare_dns_record" "apex" {
  zone_id = var.zone_id
  name    = var.domain
  type    = "CNAME"
  content = var.origin_hostname
  ttl     = 1 # 1 = automatic (required when proxied)
  proxied = true
}

# www — proxied so the Worker can intercept and redirect to apex
resource "cloudflare_dns_record" "www" {
  zone_id = var.zone_id
  name    = "www.${var.domain}"
  type    = "CNAME"
  content = var.origin_hostname
  ttl     = 1
  proxied = true
}

# ---------------------------------------------------------------------------
# Zone settings
# ---------------------------------------------------------------------------

# Full: Cloudflare <-> origin is encrypted, but origin cert hostname
# (*.aem.live) is not validated against our domain. This is correct —
# Fastly's cert covers *.aem.live, not mostly-hallucinations.com.
resource "cloudflare_zone_setting" "ssl" {
  zone_id    = var.zone_id
  setting_id = "ssl"
  value      = "full"
}

resource "cloudflare_zone_setting" "always_use_https" {
  zone_id    = var.zone_id
  setting_id = "always_use_https"
  value      = "on"
}

resource "cloudflare_zone_setting" "min_tls_version" {
  zone_id    = var.zone_id
  setting_id = "min_tls_version"
  value      = "1.2"
}

resource "cloudflare_zone_setting" "tls_1_3" {
  zone_id    = var.zone_id
  setting_id = "tls_1_3"
  value      = "zrt"
}

resource "cloudflare_zone_setting" "automatic_https_rewrites" {
  zone_id    = var.zone_id
  setting_id = "automatic_https_rewrites"
  value      = "on"
}

# Respect origin Cache-Control headers — EDS sets correct TTLs per content type
resource "cloudflare_zone_setting" "browser_cache_ttl" {
  zone_id    = var.zone_id
  setting_id = "browser_cache_ttl"
  value      = 0
}

# ---------------------------------------------------------------------------
# Redirect: www -> apex (301)
# Handled in the Worker (worker/index.mjs) — no separate ruleset needed.
# ---------------------------------------------------------------------------
