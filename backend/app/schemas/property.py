"""
Pydantic schemas (request/response models) for Property, PropertyImage, Inquiry.

"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.models import PropertyStatus


# ---------- PropertyImage ----------

class PropertyImageBase(BaseModel):
    image_url: str = Field(..., min_length=1, max_length=1024)
    is_primary: bool = False
    display_order: int = 0

    @field_validator("image_url")
    @classmethod
    def url_must_look_like_url(cls, v: str) -> str:
        v = v.strip()
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("image_url must start with http:// or https://")
        return v


class PropertyImageCreate(PropertyImageBase):
    pass


class PropertyImageRead(PropertyImageBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    property_id: int


# ---------- Property ----------

class PropertyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    location: str = Field(..., min_length=1, max_length=255)
    price: float = Field(..., gt=0, description="Price in INR, must be positive")
    size_sqft: int = Field(..., gt=0)
    bedrooms: int = Field(..., ge=0)
    description: str = Field(..., min_length=1)
    status: PropertyStatus = PropertyStatus.AVAILABLE

    @field_validator("name", "location", "description")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("field cannot be blank or whitespace-only")
        return v


class PropertyCreate(PropertyBase):
    images: list[PropertyImageCreate] = Field(default_factory=list)

    @field_validator("images")
    @classmethod
    def at_least_one_image(cls, v: list[PropertyImageCreate]) -> list[PropertyImageCreate]:
        if not v:
            raise ValueError("at least one image is required")
        return v


class PropertyUpdate(BaseModel):
    """All fields optional — partial update (PATCH semantics via PUT body)."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    location: Optional[str] = Field(None, min_length=1, max_length=255)
    price: Optional[float] = Field(None, gt=0)
    size_sqft: Optional[int] = Field(None, gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    description: Optional[str] = Field(None, min_length=1)
    status: Optional[PropertyStatus] = None
    images: Optional[list[PropertyImageCreate]] = None
    # When images is provided, it REPLACES the full set (simplest mental model
    # for an admin form that submits "here is the current list of image URLs").

    @field_validator("name", "location", "description")
    @classmethod
    def not_blank(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if not v:
            raise ValueError("field cannot be blank or whitespace-only")
        return v


class PropertyListItem(BaseModel):
    """Lightweight shape for the grid/list view — primary image only."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    location: str
    price: float
    size_sqft: int
    bedrooms: int
    status: PropertyStatus
    primary_image_url: Optional[str] = None


class PropertyRead(PropertyBase):
    """Full detail shape for the single-property page."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    images: list[PropertyImageRead] = Field(default_factory=list)


# ---------- Inquiry ----------

class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=50)
    message: str = Field(..., min_length=1)

    @field_validator("name", "message")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("field cannot be blank or whitespace-only")
        return v

    @field_validator("phone")
    @classmethod
    def phone_basic_shape(cls, v: str) -> str:
        digits = "".join(ch for ch in v if ch.isdigit())
        if len(digits) < 7:
            raise ValueError("phone must contain at least 7 digits")
        return v.strip()


class InquiryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    property_id: int
    name: str
    email: EmailStr
    phone: str
    message: str
    created_at: datetime


class InquiryWithPropertyRead(InquiryRead):
    """Used in the admin dashboard table — includes property name for context."""

    property_name: str
    property_location: str