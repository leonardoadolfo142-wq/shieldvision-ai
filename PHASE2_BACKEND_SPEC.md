# ShieldVision AI - Phase 2: Backend Specification

## Overview

Phase 2 focuses on building a production-ready FastAPI backend with real security scanning capabilities. This document provides comprehensive technical specifications.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Phase 1)                       │
│         HTML/CSS/JS Dashboard (GitHub Pages)                 │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│              API Gateway (FastAPI)                           │
│  - Request validation & authentication                       │
│  - Rate limiting & caching                                   │
│  - Error handling & logging                                  │
└────┬──────┬──────┬───────────┬──────────────────────────────┘
     │      │      │           │
     ↓      ↓      ↓           ↓
┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
│  SSL   │ │  DNS   │ │ Headers  │ │ Threat Intel │
│Scanner │ │Analyzer│ │ Checker  │ │   Service    │
└────┬───┘ └────┬───┘ └────┬─────┘ └──────┬───────┘
     │          │          │              │
     └──────────┴──────────┴──────────────┘
                   │
                   ↓
        ┌──────────────────────┐
        │  PostgreSQL Database │
        │    (Supabase)        │
        └──────────────────────┘
```

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app initialization
│   ├── config.py                # Configuration & environment
│   ├── requirements.txt          # Python dependencies
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py            # Main API endpoints
│   │   ├── health.py            # Health check endpoints
│   │   └── middleware.py        # CORS, auth, logging
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ssl_scanner.py       # SSL/TLS certificate analysis
│   │   ├── dns_analyzer.py      # DNS record inspection
│   │   ├── header_checker.py    # Security header validation
│   │   ├── threat_intel.py      # Threat intelligence
│   │   └── scan_orchestrator.py # Coordinate scans
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── domain.py            # Domain model
│   │   ├── scan.py              # Scan request/result
│   │   ├── threat.py            # Threat model
│   │   └── user.py              # User model (Phase 3)
│   │
│   ├── database/
│   │   ├── __init__.py
│   │   ├── connection.py        # DB connection pool
│   │   ├── migrations.py        # Schema migrations
│   │   └── queries.py           # SQL queries
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── validators.py        # Input validation
│   │   ├── helpers.py           # Utility functions
│   │   └── exceptions.py        # Custom exceptions
│   │
│   └── security/
│       ├── __init__.py
│       ├── ssl_utils.py         # SSL certificate parsing
│       ├── dns_utils.py         # DNS utilities
│       └── validators.py        # Validation rules
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py              # Pytest fixtures
│   ├── test_ssl_scanner.py
│   ├── test_dns_analyzer.py
│   ├── test_header_checker.py
│   └── test_api_routes.py
│
├── scripts/
│   ├── init_db.py              # Initialize database
│   ├── seed_data.py            # Populate test data
│   └── migrate.py              # Run migrations
│
├── Dockerfile                   # Container configuration
├── docker-compose.yml          # Local development environment
├── .env.example                # Environment variables template
├── .env.production             # Production secrets (git ignored)
└── README.md                   # Backend documentation
```

---

## Technology Stack

```
Runtime:     Python 3.11+
Framework:   FastAPI 0.104+
Web Server:  Uvicorn 0.24+
Database:    PostgreSQL (Supabase)
ORM:         SQLAlchemy 2.0 (optional)
Validation:  Pydantic 2.4+
Testing:     Pytest 7.4+
Monitoring:  Sentry (error tracking)
Logging:     Python logging + structlog
```

### Dependencies (requirements.txt)

```
# Web Framework
fastapi==0.104.0
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Data Validation
pydantic==2.4.0
pydantic-settings==2.0.0

# Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
cryptography==41.0.0

# Database
psycopg2-binary==2.9.9
sqlalchemy==2.0.0
alembic==1.12.1

# External APIs
requests==2.31.0
httpx==0.25.1

# DNS Tools
dnspython==2.4.0

# SSL Certificate Parsing
pyopenssl==23.3.0

# Environment Variables
python-dotenv==1.0.0

# Logging & Monitoring
sentry-sdk==1.38.0
structlog==23.2.0

# Task Queue (Phase 2+)
celery==5.3.4
redis==5.0.0

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.1

# Development
black==23.12.0
flake8==6.1.0
mypy==1.7.1
pylint==3.0.3
```

---

## API Endpoints (Phase 2)

### 1. Security Scan Endpoints

#### POST /api/v1/scan
**Start a security scan**

Request:
```json
{
  "domain": "example.com",
  "scan_types": ["ssl", "dns", "headers", "all"],
  "priority": "normal"
}
```

Response:
```json
{
  "scan_id": "uuid-string",
  "domain": "example.com",
  "status": "pending",
  "created_at": "2026-01-15T10:30:00Z",
  "estimated_completion": "2026-01-15T10:32:00Z"
}
```

#### GET /api/v1/scan/{scan_id}
**Get scan status and results**

Response:
```json
{
  "scan_id": "uuid-string",
  "domain": "example.com",
  "status": "completed",
  "results": {
    "ssl": {
      "valid": true,
      "issuer": "Let's Encrypt",
      "expires_at": "2027-01-15",
      "days_until_expiry": 365,
      "protocols": ["TLSv1.2", "TLSv1.3"],
      "certificate_chain": [...],
      "issues": []
    },
    "dns": {
      "records": {
        "A": ["93.184.216.34"],
        "MX": ["mail.example.com"],
        "TXT": ["v=spf1 ..."]
      },
      "is_secure": true,
      "has_dnssec": true,
      "issues": []
    },
    "headers": {
      "present": [
        "content-security-policy",
        "x-frame-options",
        "strict-transport-security"
      ],
      "missing": [
        "x-content-type-options"
      ],
      "security_score": 85
    }
  },
  "security_score": 82,
  "completed_at": "2026-01-15T10:32:00Z"
}
```

#### GET /api/v1/scans
**List recent scans** (with pagination)

Query Parameters:
```
?limit=10&offset=0&status=completed&sort=-created_at
```

Response:
```json
{
  "scans": [...],
  "total": 150,
  "limit": 10,
  "offset": 0
}
```

---

### 2. Threat Intelligence Endpoints

#### GET /api/v1/threats
**Get threat intelligence data**

Query Parameters:
```
?severity=high&limit=50&offset=0&location=all
```

Response:
```json
{
  "threats": [
    {
      "id": 1,
      "type": "malware",
      "severity": "high",
      "location": "US",
      "affected_systems": 1250,
      "description": "Detected botnet C2 communication...",
      "mitigation": "Block IP ranges 192.168.x.x",
      "timestamp": "2026-01-15T10:15:00Z"
    }
  ],
  "total": 42,
  "summary": {
    "critical": 2,
    "high": 8,
    "medium": 15,
    "low": 17
  }
}
```

#### GET /api/v1/threats/globe
**Get threat data for globe visualization**

Response:
```json
{
  "threats": [
    {
      "id": 1,
      "latitude": 40.7128,
      "longitude": -74.0060,
      "location": "New York, US",
      "severity": "high",
      "type": "botnet",
      "intensity": 8.5
    }
  ],
  "timestamp": "2026-01-15T10:30:00Z"
}
```

---

### 3. Health & Status Endpoints

#### GET /api/v1/health
**Health check**

Response:
```json
{
  "status": "healthy",
  "version": "0.2.0",
  "database": "connected",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

#### GET /api/v1/stats
**API statistics**

Response:
```json
{
  "scans_completed_today": 1250,
  "average_scan_time_ms": 2500,
  "api_uptime_percentage": 99.98,
  "active_users": 542
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Scans Table
```sql
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  domain VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  security_score INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  INDEX (user_id, created_at),
  INDEX (domain, created_at)
);
```

### Scan Results Table
```sql
CREATE TABLE scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  result_type VARCHAR(50),
  result_data JSONB,
  duration_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (scan_id)
);
```

### Threats Table
```sql
CREATE TABLE threats (
  id SERIAL PRIMARY KEY,
  threat_type VARCHAR(50),
  severity VARCHAR(20),
  location VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  affected_systems INT,
  mitigation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (severity, created_at)
);
```

---

## Core Service Implementations

### SSL Scanner (ssl_scanner.py)

```python
import ssl
import socket
from datetime import datetime
from typing import Dict, List

class SSLScanner:
    """Scan SSL/TLS certificates and configurations."""
    
    async def scan(self, domain: str) -> Dict:
        """
        Comprehensive SSL certificate analysis.
        
        Returns:
            - Certificate validity
            - Expiration date
            - Chain verification
            - Protocol support
            - Cipher strength
            - Issues found
        """
        try:
            cert = self._get_certificate(domain)
            return {
                "valid": True,
                "issuer": cert.get('issuer'),
                "issued_to": cert.get('subject'),
                "expires_at": cert.get('notAfter'),
                "days_until_expiry": self._calculate_days(cert),
                "protocols": self._get_protocols(domain),
                "certificate_chain": self._verify_chain(domain),
                "cipher_strength": self._check_cipher_strength(domain),
                "issues": self._check_vulnerabilities(cert),
                "scan_time_ms": 2500
            }
        except Exception as e:
            return {"valid": False, "error": str(e)}
    
    def _get_certificate(self, domain: str) -> Dict:
        """Retrieve SSL certificate from domain."""
        context = ssl.create_default_context()
        with socket.create_connection((domain, 443), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=domain) as ssock:
                return ssock.getpeercert()
    
    def _calculate_days(self, cert: Dict) -> int:
        """Calculate days until certificate expiry."""
        not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
        return (not_after - datetime.now()).days
    
    def _get_protocols(self, domain: str) -> List[str]:
        """Check supported TLS protocols."""
        supported = []
        for protocol in ['TLSv1.0', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3']:
            if self._test_protocol(domain, protocol):
                supported.append(protocol)
        return supported
    
    def _check_vulnerabilities(self, cert: Dict) -> List[Dict]:
        """Check for known SSL/TLS vulnerabilities."""
        issues = []
        days = self._calculate_days(cert)
        
        if days < 30:
            issues.append({
                "severity": "high",
                "issue": "Certificate expiring soon",
                "days_remaining": days
            })
        
        return issues
```

### DNS Analyzer (dns_analyzer.py)

```python
import dns.resolver
import dns.dnssec
from typing import Dict, List

class DNSAnalyzer:
    """Analyze DNS records and security configurations."""
    
    async def analyze(self, domain: str) -> Dict:
        """
        Comprehensive DNS analysis.
        
        Returns:
            - A records
            - MX records
            - TXT records (SPF, DKIM, DMARC)
            - DNSSEC status
            - Issues found
        """
        try:
            resolver = dns.resolver.Resolver()
            
            return {
                "records": {
                    "A": self._get_a_records(domain),
                    "AAAA": self._get_aaaa_records(domain),
                    "MX": self._get_mx_records(domain),
                    "TXT": self._get_txt_records(domain),
                    "CNAME": self._get_cname_records(domain)
                },
                "spf": self._check_spf(domain),
                "dkim": self._check_dkim(domain),
                "dmarc": self._check_dmarc(domain),
                "dnssec": self._check_dnssec(domain),
                "issues": self._find_issues(domain),
                "scan_time_ms": 1500
            }
        except Exception as e:
            return {"error": str(e)}
    
    def _get_a_records(self, domain: str) -> List[str]:
        """Get A records (IPv4)."""
        try:
            answers = dns.resolver.resolve(domain, 'A')
            return [str(rdata) for rdata in answers]
        except:
            return []
    
    def _check_spf(self, domain: str) -> Dict:
        """Validate SPF record."""
        txt_records = self._get_txt_records(domain)
        spf_record = next((r for r in txt_records if r.startswith('v=spf1')), None)
        
        return {
            "present": spf_record is not None,
            "record": spf_record,
            "valid": self._validate_spf(spf_record) if spf_record else False
        }
    
    def _check_dmarc(self, domain: str) -> Dict:
        """Validate DMARC record."""
        try:
            answers = dns.resolver.resolve(f'_dmarc.{domain}', 'TXT')
            record = str(answers[0])
            return {
                "present": True,
                "record": record,
                "policy": self._extract_dmarc_policy(record)
            }
        except:
            return {"present": False}
```

### Security Header Checker (header_checker.py)

```python
import httpx
from typing import Dict, List

class HeaderChecker:
    """Check security headers and configurations."""
    
    SECURITY_HEADERS = {
        'content-security-policy': 'CSP',
        'x-frame-options': 'Clickjacking protection',
        'x-content-type-options': 'MIME type sniffing',
        'strict-transport-security': 'HTTPS enforcement',
        'referrer-policy': 'Referrer control',
        'x-xss-protection': 'XSS protection'
    }
    
    async def check(self, domain: str) -> Dict:
        """
        Check HTTP security headers.
        
        Returns:
            - Present headers
            - Missing headers
            - Header values analysis
            - Security score
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f'https://{domain}',
                    timeout=10,
                    follow_redirects=True
                )
            
            headers = response.headers
            
            return {
                "present": self._check_present(headers),
                "missing": self._check_missing(headers),
                "details": self._analyze_headers(headers),
                "security_score": self._calculate_score(headers),
                "issues": self._find_issues(headers),
                "scan_time_ms": 800
            }
        except Exception as e:
            return {"error": str(e)}
    
    def _calculate_score(self, headers: Dict) -> int:
        """Calculate security score based on headers."""
        score = 50  # Base score
        
        for header in self.SECURITY_HEADERS.keys():
            if header.lower() in {k.lower() for k in headers.keys()}:
                score += 10
        
        return min(score, 100)
```

---

## Implementation Phases

### Phase 2.1: Core API & SSL Scanner (Week 1-2)
- [ ] Setup FastAPI project structure
- [ ] Implement SSL Scanner service
- [ ] Create /api/v1/scan endpoint
- [ ] Setup database migrations
- [ ] Write unit tests

### Phase 2.2: DNS & Headers (Week 3)
- [ ] Implement DNS Analyzer
- [ ] Implement Header Checker
- [ ] Integrate all scanners into orchestrator
- [ ] Add caching layer

### Phase 2.3: Threat Intelligence (Week 4)
- [ ] Setup threat data source
- [ ] Implement threat endpoints
- [ ] Add globe visualization data
- [ ] Create threat feed

### Phase 2.4: Testing & Optimization (Week 5-6)
- [ ] Integration testing
- [ ] Load testing
- [ ] Performance optimization
- [ ] Documentation

---

## Testing Strategy

```bash
# Unit tests (individual services)
pytest tests/services/ -v

# Integration tests (API endpoints)
pytest tests/api/ -v

# Coverage report
pytest --cov=app tests/ --cov-report=html

# Load testing
locust -f tests/load_test.py --host=http://localhost:8000
```

---

## Deployment (Phase 2)

### Docker Setup
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables
```
DATABASE_URL=postgresql://user:pass@host/db
SENTRY_DSN=https://...
API_RATE_LIMIT=1000
CACHE_TTL=3600
LOG_LEVEL=INFO
```

---

## Success Metrics

- API response time: < 500ms
- Scan accuracy: > 95%
- Database query time: < 100ms
- API uptime: > 99%
- Test coverage: > 80%

---

## Next: Phase 3

Once Phase 2 backend is stable, add:
- User authentication
- Saved scans per user
- Scan history
- User preferences
- Subscription management
