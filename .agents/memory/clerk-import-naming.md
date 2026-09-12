---
name: Clerk import naming
description: A setup constraint for provisioning Replit-managed Clerk in imported projects.
---

Replit-managed Clerk provisioning can reject an imported project name when the name still includes a zip-upload suffix such as `.zip`; the Clerk application-name validator treats that form as invalid.

**Why:** An imported ZM FactoryOS project attempted to provision with a zip-derived name and Clerk rejected it before creating the tenant.

**How to apply:** Before retrying managed Clerk provisioning for an imported project, ensure the workspace/project name is a valid product name without archive suffixes or URL-like characters. Never work around the error by adding fake auth or exposing protected routes.