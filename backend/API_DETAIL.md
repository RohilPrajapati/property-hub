# API Documentation

## Base URL
```
http://localhost:8000
```

---

## 1. Login

```
POST /login/
```

**Request body:**
```json
{
    "username": "rohil",
    "password": "prajapati"
}
```

**Response:**
```json
{
    
    "access": "eyJhbGci...",
    "refresh": "eyJhbGci...",
    "user": {
        "id": 1,
        "username": "rohil",
        "email": "rohil@gmail.com",
        "is_admin": true
    }
}
```

---

## 2. List Properties

```
GET /listings/?page_size=9
```

**Query params:**

| Param | Type | Required | Example |
|-------|------|----------|---------|
| `page_size` | number | No | `9` |
| `min_price` | number | No | `400000` |
| `max_price` | number | No | `1000000` |
| `suburb` | string | No | `Thamel` |
| `search` | string | No | `house in kathmandu` |
| `property_type` | string | No | `house` |
| `min_bedrooms` | number | No | `2` |
| `min_bathrooms` | number | No | `1` |
| `cursor` | string | No | `cD0yMDI2...` (from previous response) |

**Response:**
```json
{
    "next": "http://localhost:8000/listings/?cursor=cD0yMDI2...&page_size=9",
    "previous": null,
    "results": [
        {
            "id": 3,
            "title": "Renovated house with large backyard in Boudha",
            "description": "...",
            "image": "/media/properties/743f2176.jpg",
            "suburb": "Boudha",
            "price": "15000000.00",
            "bedrooms": 2,
            "bathrooms": 1,
            "property_type": "house",
            "is_published": true,
            "created_at": "2026-03-28T12:10:04.801799Z",
            "agent": 12,
            "agent_detail": {
                "id": 12,
                "name": "Prakash Koirala",
                "email": "prakash.koirala501@gmail.com",
                "phone": "+977-9841889738",
                "license_number": "NRB-7180-14",
                "created_at": "2026-03-28T12:07:07.889725Z"
            }
        }
    ]
}
```

---

## 3. Property Detail

```
GET /listings/{id}
```

**Auth:** Bearer token required

**Headers:**
```
Authorization: Bearer eyJhbGci...
```

**Response (non-admin):**
```json
{
    "id": 39,
    "title": "Renovated house with large backyard in Boudha",
    "description": "...",
    "image": "/media/properties/743f2176.jpg",
    "suburb": "Boudha",
    "price": "15000000.00",
    "bedrooms": 2,
    "bathrooms": 1,
    "property_type": "house",
    "is_published": true,
    "created_at": "2026-03-28T12:10:04.801799Z",
    "agent": 12,
    "agent_detail": {
        "id": 12,
        "name": "Prakash Koirala",
        "email": "prakash.koirala501@gmail.com",
        "phone": "+977-9841889738",
        "license_number": "NRB-7180-14",
        "created_at": "2026-03-28T12:07:07.889725Z"
    },
    "internal_notes": null
}
```

**Response (admin only — includes internal_notes field with values):**
```json
{
    "id": 39,
    "title": "Renovated house with large backyard in Boudha",
    "description": "...",
    "image": "/media/properties/743f2176.jpg",
    "suburb": "Boudha",
    "price": "15000000.00",
    "bedrooms": 2,
    "bathrooms": 1,
    "property_type": "house",
    "is_published": true,
    "created_at": "2026-03-28T12:10:04.801799Z",
    "agent": 12,
    "agent_detail": {
        "id": 12,
        "name": "Prakash Koirala",
        "email": "prakash.koirala501@gmail.com",
        "phone": "+977-9841889738",
        "license_number": "NRB-7180-14",
        "created_at": "2026-03-28T12:07:07.889725Z"
    },
    "internal_notes": "Seller willing to negotiate. Contact before listing expires."
}
```

---

## Authentication Notes

- Access token expires — send refresh token to get a new one
- `is_admin: true` in the JWT payload unlocks admin-only fields
- Store tokens in `localStorage` and attach as `Authorization: Bearer <token>` header