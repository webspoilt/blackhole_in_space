# VAULT Enterprise Deployment Guide

## For IT Administrators & DevOps Teams

This guide walks through deploying VAULT Enterprise in government and regulated enterprise environments.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Network Requirements](#network-requirements)
3. [Deployment Options](#deployment-options)
4. [Kubernetes (Helm) Deployment](#kubernetes-helm-deployment)
5. [Air-Gapped Installation](#air-gapped-installation)
6. [Database Configuration](#database-configuration)
7. [Identity Integration (LDAP/SAML)](#identity-integration)
8. [Backup & Recovery](#backup--recovery)
9. [Monitoring & Audit](#monitoring--audit)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Relay Server** | 4 vCPU, 8GB RAM | 8 vCPU, 16GB RAM |
| **Core Service** | 4 vCPU, 4GB RAM | 8 vCPU, 8GB RAM |
| **Database** | 4 vCPU, 16GB RAM, 100GB SSD | 8 vCPU, 32GB RAM, 500GB NVMe |
| **Redis Cache** | 2 vCPU, 4GB RAM | 4 vCPU, 8GB RAM |

### Software Requirements

- **Kubernetes**: 1.25+ (for Helm deployment)
- **Docker**: 24.0+ (for container deployment)
- **PostgreSQL**: 14+ (for audit log storage)
- **Redis**: 7+ (for session management)

---

## Network Requirements

### Firewall Ports

| Port | Protocol | Direction | Purpose |
|------|----------|-----------|---------|
| **443** | TCP | Inbound | HTTPS/WSS (Client connections) |
| **5432** | TCP | Internal | PostgreSQL Database |
| **6379** | TCP | Internal | Redis Cache |
| **9090** | TCP | Internal | Prometheus Metrics |

### TLS Requirements

- **Minimum**: TLS 1.2
- **Recommended**: TLS 1.3
- **Certificate**: Must be signed by a trusted CA (internal PKI or public)
- **Cipher Suites**: ECDHE-RSA-AES256-GCM-SHA384, ECDHE-RSA-AES128-GCM-SHA256

### DNS Configuration

```
vault.your-agency.gov    →  Load Balancer IP (Relay Service)
vault-api.your-agency.gov →  API Gateway IP (if separate)
```

---

## Deployment Options

### Option 1: Kubernetes (Recommended)

Best for: Cloud environments, GovCloud, scalable deployments.

```bash
helm install vault ./helm -f values-production.yaml
```

### Option 2: Docker Compose

Best for: Single-server, development, or small deployments.

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: Air-Gapped ISO

Best for: SIPRNet, JWICS, classified networks with no internet.

See [Air-Gapped Installation](#air-gapped-installation).

---

## Kubernetes (Helm) Deployment

### Step 1: Add the VAULT Helm Repository

```bash
# For internet-connected environments
helm repo add vault-enterprise https://charts.vault.gov
helm repo update
```

### Step 2: Create Namespace

```bash
kubectl create namespace vault-system
kubectl label namespace vault-system name=vault-system
```

### Step 3: Create Secrets

```bash
# Database credentials
kubectl create secret generic vault-db-secret \
  --namespace vault-system \
  --from-literal=postgres-password='YOUR_SECURE_PASSWORD'

# Redis credentials
kubectl create secret generic vault-redis-secret \
  --namespace vault-system \
  --from-literal=redis-password='YOUR_SECURE_PASSWORD'

# TLS certificate (if not using cert-manager)
kubectl create secret tls vault-tls \
  --namespace vault-system \
  --cert=./certs/vault.crt \
  --key=./certs/vault.key
```

### Step 4: Customize Values

Create a `values-production.yaml` file:

```yaml
relay:
  replicaCount: 3
  ingress:
    hosts:
      - host: vault.your-agency.gov

postgresql:
  primary:
    persistence:
      size: 500Gi
      storageClass: "encrypted-gp3"

security:
  networkPolicy:
    enabled: true
```

### Step 5: Deploy

```bash
helm install vault vault-enterprise/vault \
  --namespace vault-system \
  --values values-production.yaml \
  --wait
```

### Step 6: Verify

```bash
kubectl get pods -n vault-system
kubectl get svc -n vault-system
```

---

## Air-Gapped Installation

For networks with no internet connectivity (SIPRNet, JWICS).

### Step 1: Download Offline Bundle

On an internet-connected workstation:

```bash
# Download the offline ISO (includes all container images)
wget https://releases.vault.gov/enterprise/vault-enterprise-4.2.0-airgap.iso
sha256sum vault-enterprise-4.2.0-airgap.iso
# Verify: abc123...xyz (check official release notes)
```

### Step 2: Transfer to Air-Gapped Network

Use approved media (CD-R, encrypted USB) per your agency's policies.

### Step 3: Load Container Images

```bash
# Mount the ISO
mount -o loop vault-enterprise-4.2.0-airgap.iso /mnt/vault

# Load images into your internal registry
docker load < /mnt/vault/images/vault-relay-4.2.0.tar
docker load < /mnt/vault/images/vault-core-4.2.0.tar
docker tag vault-relay:4.2.0 registry.local:5000/vault-relay:4.2.0
docker push registry.local:5000/vault-relay:4.2.0
```

### Step 4: Deploy with Air-Gap Values

```yaml
# values-airgap.yaml
airgap:
  enabled: true
  registry: "registry.local:5000"

postgresql:
  image:
    registry: registry.local:5000
```

```bash
helm install vault ./helm -f values-airgap.yaml
```

---

## Database Configuration

### Storage Sizing

| Users | Messages/Day | Recommended DB Size | Backup Frequency |
|-------|--------------|---------------------|------------------|
| < 100 | 10,000 | 100 GB | Daily |
| 100-1,000 | 100,000 | 500 GB | Every 6 hours |
| 1,000-10,000 | 1,000,000 | 2 TB | Hourly |
| > 10,000 | 10,000,000+ | 10 TB+ (Sharded) | Continuous |

### Encryption at Rest

```yaml
postgresql:
  primary:
    persistence:
      storageClass: "encrypted-gp3"  # AWS
      # or "encrypted-ssd" for GCP
```

---

## Identity Integration

### SAML 2.0 (Recommended for Federal)

VAULT supports SAML 2.0 for Single Sign-On with identity providers:

- **OKTA**
- **Azure AD / Entra ID**
- **Ping Identity**
- **ADFS (Active Directory Federation Services)**

Configuration in `values.yaml`:

```yaml
relay:
  env:
    SAML_ENABLED: "true"
    SAML_METADATA_URL: "https://idp.your-agency.gov/metadata.xml"
    SAML_ENTITY_ID: "vault-enterprise"
```

### LDAP / Active Directory

For direct LDAP integration:

```yaml
relay:
  env:
    LDAP_ENABLED: "true"
    LDAP_URL: "ldaps://dc.your-agency.gov:636"
    LDAP_BASE_DN: "OU=Users,DC=agency,DC=gov"
    LDAP_BIND_DN: "CN=vault-svc,OU=ServiceAccounts,DC=agency,DC=gov"
    # Use Kubernetes secret for bind password
```

---

## Backup & Recovery

### Automated Backups

```yaml
postgresql:
  backup:
    enabled: true
    cronjob:
      schedule: "0 */6 * * *"  # Every 6 hours
    storage:
      storageClass: "standard"
      size: 100Gi
```

### Manual Backup

```bash
kubectl exec -n vault-system vault-postgresql-0 -- \
  pg_dump -U vault vault_audit > backup-$(date +%Y%m%d).sql
```

### Recovery

```bash
kubectl exec -i -n vault-system vault-postgresql-0 -- \
  psql -U vault vault_audit < backup-20260201.sql
```

---

## Monitoring & Audit

### Prometheus Metrics

VAULT exposes metrics at `/metrics`:

- `vault_messages_sent_total`
- `vault_active_connections`
- `vault_encryption_operations_seconds`

### Immutable Audit Log Export

For SIEM integration (Splunk, Elastic):

```yaml
monitoring:
  auditLog:
    siem:
      enabled: true
      endpoint: "https://splunk.your-agency.gov:8088/services/collector"
      secretName: "splunk-hec-token"
```

---

## Troubleshooting

### Common Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| Pods stuck in `Pending` | Insufficient resources | Increase node pool size |
| TLS handshake failures | Certificate mismatch | Verify cert matches hostname |
| Database connection refused | Network policy blocking | Check `NetworkPolicy` rules |
| High latency | Redis cache miss | Increase Redis memory |

### Support

- **Enterprise Support**: support@vault.gov
- **Documentation**: https://docs.vault.gov
- **Status Page**: https://status.vault.gov

---

© 2024 VAULT Enterprise. All rights reserved.
