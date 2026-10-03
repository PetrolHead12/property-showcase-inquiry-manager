"""
Inquiries router: buyer submits via property detail page; admin views all.

Place at: backend/app/api/routes/inquiries.py
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.models import Inquiry, Property
from app.schemas.property import InquiryCreate, InquiryRead, InquiryWithPropertyRead

router = APIRouter(tags=["inquiries"])


@router.post(
    "/properties/{property_id}/inquiries",
    response_model=InquiryRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_inquiry(
    property_id: int, payload: InquiryCreate, db: AsyncSession = Depends(get_db)
):
    """Buyer submits an inquiry from a property detail page."""
    prop = await db.get(Property, property_id)
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")

    inquiry = Inquiry(
        property_id=property_id,
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        message=payload.message,
    )
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)
    return inquiry


@router.get("/inquiries", response_model=list[InquiryWithPropertyRead])
async def list_inquiries(
    db: AsyncSession = Depends(get_db),
    property_id: Optional[int] = Query(None, description="Filter to one property"),
):
    """
    Admin dashboard view: all inquiries, newest first, with the related
    property's name/location joined in so the table is readable without
    a second lookup per row.
    """
    stmt = (
        select(Inquiry, Property.name, Property.location)
        .join(Property, Inquiry.property_id == Property.id)
        .order_by(Inquiry.created_at.desc())
    )
    if property_id is not None:
        stmt = stmt.where(Inquiry.property_id == property_id)

    result = await db.execute(stmt)
    rows = result.all()

    return [
        InquiryWithPropertyRead(
            id=inquiry.id,
            property_id=inquiry.property_id,
            name=inquiry.name,
            email=inquiry.email,
            phone=inquiry.phone,
            message=inquiry.message,
            created_at=inquiry.created_at,
            property_name=prop_name,
            property_location=prop_location,
        )
        for inquiry, prop_name, prop_location in rows
    ]