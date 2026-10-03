"""
SQLAlchemy ORM models for the Property Showcase & Inquiry Manager.
"""

import enum

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.core.db import Base


class PropertyStatus(str, enum.Enum):
    AVAILABLE = "available"
    UNDER_OFFER = "under_offer"
    SOLD = "sold"


class Property(Base):
    __tablename__ = "properties"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(255),
        nullable=False,
    )

    location = Column(
        String(255),
        nullable=False,
        index=True,
    )

    price = Column(
        Numeric(14, 2),
        nullable=False,
    )

    size_sqft = Column(
        Integer,
        nullable=False,
    )

    bedrooms = Column(
        Integer,
        nullable=False,
        index=True,
    )

    description = Column(
        Text,
        nullable=False,
    )

    status = Column(
    Enum(
        PropertyStatus,
        name="property_status",
        values_callable=lambda enum_class: [
            member.value for member in enum_class
        ],
    ),
    nullable=False,
    default=PropertyStatus.AVAILABLE,
    server_default=PropertyStatus.AVAILABLE.value,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    images = relationship(
        "PropertyImage",
        back_populates="property",
        cascade="all, delete-orphan",
        order_by="PropertyImage.display_order",
    )

    inquiries = relationship(
        "Inquiry",
        back_populates="property",
    )

    __table_args__ = (
        CheckConstraint(
            "price > 0",
            name="ck_properties_price_positive",
        ),
        CheckConstraint(
            "size_sqft > 0",
            name="ck_properties_size_positive",
        ),
        CheckConstraint(
            "bedrooms >= 0",
            name="ck_properties_bedrooms_nonneg",
        ),
    )


class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    property_id = Column(
        Integer,
        ForeignKey(
            "properties.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    image_url = Column(
        String(1024),
        nullable=False,
    )

    is_primary = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    display_order = Column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    property = relationship(
        "Property",
        back_populates="images",
    )


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    property_id = Column(
        Integer,
        ForeignKey(
            "properties.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    name = Column(
        String(255),
        nullable=False,
    )

    email = Column(
        String(255),
        nullable=False,
    )

    phone = Column(
        String(50),
        nullable=False,
    )

    message = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    property = relationship(
        "Property",
        back_populates="inquiries",
    )