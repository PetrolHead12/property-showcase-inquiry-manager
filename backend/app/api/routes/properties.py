"""
Properties router: list (with filter/sort), detail, create, update, delete.

"""
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.deps import get_db
from app.models.models import Property, PropertyImage, PropertyStatus
from app.schemas.property import (
    PropertyCreate,
    PropertyListItem,
    PropertyRead,
    PropertyUpdate,
)

router = APIRouter(prefix="/properties", tags=["properties"])


SortField = Literal["price", "bedrooms", "size_sqft", "created_at"]
SortDir = Literal["asc", "desc"]


@router.get("", response_model=list[PropertyListItem])
async def list_properties(
    db: AsyncSession = Depends(get_db),
    location: Optional[str] = Query(None, description="Case-insensitive partial match"),
    bedrooms: Optional[int] = Query(None, ge=0),
    min_price: Optional[float] = Query(None, gt=0),
    max_price: Optional[float] = Query(None, gt=0),
    status_filter: Optional[PropertyStatus] = Query(None, alias="status"),
    sort_by: SortField = Query("created_at"),
    sort_dir: SortDir = Query("desc"),
):
    """
    Grid/list view. Returns lightweight items (primary image only).
    Supports filtering by location (partial match), bedrooms (exact),
    price range, and status; sortable by price/bedrooms/size/created_at.
    """
    stmt = select(Property).options(selectinload(Property.images))

    if location:
        stmt = stmt.where(Property.location.ilike(f"%{location}%"))
    if bedrooms is not None:
        stmt = stmt.where(Property.bedrooms == bedrooms)
    if min_price is not None:
        stmt = stmt.where(Property.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Property.price <= max_price)
    if status_filter is not None:
        stmt = stmt.where(Property.status == status_filter)

    sort_column = getattr(Property, sort_by)
    stmt = stmt.order_by(sort_column.asc() if sort_dir == "asc" else sort_column.desc())

    result = await db.execute(stmt)
    properties = result.scalars().all()

    items = []
    for p in properties:
        primary = next((img for img in p.images if img.is_primary), None)
        if primary is None and p.images:
            primary = p.images[0]  # fall back to first image if none marked primary
        items.append(
            PropertyListItem(
                id=p.id,
                name=p.name,
                location=p.location,
                price=float(p.price),
                size_sqft=p.size_sqft,
                bedrooms=p.bedrooms,
                status=p.status,
                primary_image_url=primary.image_url if primary else None,
            )
        )
    return items


@router.get("/{property_id}", response_model=PropertyRead)
async def get_property(property_id: int, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Property)
        .options(selectinload(Property.images))
        .where(Property.id == property_id)
    )
    result = await db.execute(stmt)
    prop = result.scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


@router.post("", response_model=PropertyRead, status_code=status.HTTP_201_CREATED)
async def create_property(payload: PropertyCreate, db: AsyncSession = Depends(get_db)):
    prop = Property(
        name=payload.name,
        location=payload.location,
        price=payload.price,
        size_sqft=payload.size_sqft,
        bedrooms=payload.bedrooms,
        description=payload.description,
        status=payload.status,
    )
    # Ensure exactly one primary image: if none flagged, make the first one primary.
    images = payload.images
    if images and not any(img.is_primary for img in images):
        images = [
            img.model_copy(update={"is_primary": idx == 0})
            for idx, img in enumerate(images)
        ]
    prop.images = [
        PropertyImage(
            image_url=img.image_url,
            is_primary=img.is_primary,
            display_order=img.display_order,
        )
        for img in images
    ]

    db.add(prop)
    await db.commit()
    await db.refresh(prop, attribute_names=["images"])
    return prop


@router.put("/{property_id}", response_model=PropertyRead)
async def update_property(
    property_id: int, payload: PropertyUpdate, db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Property)
        .options(selectinload(Property.images))
        .where(Property.id == property_id)
    )
    result = await db.execute(stmt)
    prop = result.scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")

    update_data = payload.model_dump(exclude_unset=True, exclude={"images"})
    for field, value in update_data.items():
        setattr(prop, field, value)

    if payload.images is not None:
        if not payload.images:
            raise HTTPException(
                status_code=422, detail="images list cannot be emptied to zero entries"
            )
        images = payload.images
        if not any(img.is_primary for img in images):
            images = [
                img.model_copy(update={"is_primary": idx == 0})
                for idx, img in enumerate(images)
            ]
        # Replace wholesale — simplest correct behavior for "edit form resubmits full list"
        prop.images = [
            PropertyImage(
                image_url=img.image_url,
                is_primary=img.is_primary,
                display_order=img.display_order,
            )
            for img in images
        ]

    await db.commit()
    await db.refresh(prop, attribute_names=["images"])
    return prop


@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(property_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Property).where(Property.id == property_id)
    result = await db.execute(stmt)
    prop = result.scalar_one_or_none()
    if prop is None:
        raise HTTPException(status_code=404, detail="Property not found")

    await db.delete(prop)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Cannot delete this property: it ha****isting inquiries. "
                "Remove or reassign those inquiries first."
            ),
        )