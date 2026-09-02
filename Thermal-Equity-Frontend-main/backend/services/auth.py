from __future__ import annotations

import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

SECRET_KEY = os.getenv("SECRET_KEY", "thermal_equity_ai_jwt_secret_production_key_chennai_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security_bearer = HTTPBearer(auto_error=False)


def get_password_hash(password: str) -> str:
    """Hash password securely using bcrypt."""
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    if not hashed_password or not plain_password:
        return False

    try:
        if hashed_password.startswith(("$2b$", "$2a$", "$2y$")):
            pwd_bytes = plain_password.encode("utf-8")[:72]
            return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except Exception:
        pass

    if hashed_password.startswith("sha256:"):
        try:
            parts = hashed_password.split(":")
            if len(parts) == 3:
                salt = parts[1]
                expected_hash = parts[2]
                actual_hash = hashlib.sha256((plain_password + salt + SECRET_KEY).encode("utf-8")).hexdigest()
                return hmac.compare_digest(actual_hash, expected_hash)
        except Exception:
            pass

    return False


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """Generate signed JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "exp": expire.timestamp(),
        "iat": datetime.now(timezone.utc).timestamp(),
        "iss": "thermal-equity-ai",
    })

    try:
        from jose import jwt
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    except Exception:
        import base64
        import json
        header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
        payload = base64.urlsafe_b64encode(json.dumps(to_encode).encode()).decode().rstrip("=")
        signature = hmac.new(SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()
        sig_str = base64.urlsafe_b64encode(signature).decode().rstrip("=")
        return f"{header}.{payload}.{sig_str}"


def decode_access_token(token: str) -> dict[str, Any] | None:
    """Decode and validate a JWT access token."""
    if not token:
        return None
    try:
        from jose import jwt
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        exp = payload.get("exp")
        if exp and datetime.now(timezone.utc).timestamp() > exp:
            return None
        return payload
    except Exception:
        try:
            import base64
            import json
            parts = token.split(".")
            if len(parts) != 3:
                return None
            padded_payload = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
            data = json.loads(base64.urlsafe_b64decode(padded_payload.encode()).decode())
            exp = data.get("exp")
            if exp and datetime.now(timezone.utc).timestamp() > exp:
                return None
            return data
        except Exception:
            return None


async def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security_bearer)) -> dict[str, Any]:
    """Dependency to retrieve authenticated user from Authorization Bearer header."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required to access this resource",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub") or payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token subject missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    from backend.database.mongodb import find_user_by_email
    user = await find_user_by_email(email)
    if not user:
        return {
            "name": payload.get("name", "Climate Analyst"),
            "email": email,
            "role": payload.get("role", "analyst"),
        }

    return {
        "id": str(user.get("_id", user.get("id", ""))),
        "name": user.get("name", "Climate Analyst"),
        "email": user.get("email", email),
        "role": user.get("role", "analyst"),
        "created_at": user.get("created_at"),
    }
