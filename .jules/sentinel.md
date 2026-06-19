## 2025-05-14 - API Authentication Bypass when OIDC is Disabled
**Vulnerability:** When OIDC authentication was disabled, the API middleware skipped all security checks, making all endpoints (including `/backup` which exposes the entire database) public.
**Learning:** The middleware only checked `oidc.enabled()` before proceeding. In default configurations where OIDC is often disabled but API keys might be intended to be the primary auth method, this left the application insecure.
**Prevention:** Always ensure that if any authentication method (like API keys) is configured, it is enforced even if the primary method (OIDC) is disabled. The middleware should check for API keys first, and then decide based on OIDC status.
