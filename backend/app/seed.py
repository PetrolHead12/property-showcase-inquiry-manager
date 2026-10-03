"""
Seed script: populates demo properties, images, and inquiries for local dev
and reviewer walkthroughs.

Place at: backend/app/seed.py
Run from backend/ with:  python -m app.seed

Safe to re-run: it checks for existing data and exits early rather than
duplicating rows, so you don't need to remember to truncate tables first.
"""
import asyncio

from app.core.db import async_session_maker
from app.models.models import Inquiry, Property, PropertyImage, PropertyStatus

PROPERTIES = [
    {
        "name": "Whitefield Sky Villa",
        "location": "Whitefield, Bengaluru",
        "price": 45_000_000,
        "size_sqft": 3200,
        "bedrooms": 4,
        "description": (
            "A sun-lit villa set back from the road behind a private garden, "
            "built around a double-height living room and a terrace designed "
            "for evening entertaining. Finished with imported stone flooring "
            "throughout and a home automation system covering lighting, "
            "climate, and security."
        ),
        "status": PropertyStatus.AVAILABLE,
        "images": [
            "https://picsum.photos/id/1040/1200/800",
            "https://picsum.photos/id/1041/1200/800",
        ],
    },
    {
        "name": "Indiranagar Garden Residence",
        "location": "Indiranagar, Bengaluru",
        "price": 32_500_000,
        "size_sqft": 2400,
        "bedrooms": 3,
        "description": (
            "A quietly elegant home on a tree-lined street, walking distance "
            "from Indiranagar's main shopping and dining strip. The ground "
            "floor opens onto a walled private garden, with a study and "
            "a dedicated home theatre on the upper level."
        ),
        "status": PropertyStatus.UNDER_OFFER,
        "images": [
            "https://picsum.photos/id/1048/1200/800",
            "https://picsum.photos/id/1050/1200/800",
        ],
    },
    {
        "name": "Sarjapur Lakeview Estate",
        "location": "Sarjapur Road, Bengaluru",
        "price": 68_000_000,
        "size_sqft": 4800,
        "bedrooms": 5,
        "description": (
            "An expansive five-bedroom estate overlooking a private lake "
            "frontage, built across two levels with a separate guest wing. "
            "Features include an infinity-edge pool, a landscaped courtyard, "
            "and a dedicated staff quarter with independent access."
        ),
        "status": PropertyStatus.AVAILABLE,
        "images": [
            "https://picsum.photos/id/1052/1200/800",
            "https://picsum.photos/id/1054/1200/800",
            "https://picsum.photos/id/1056/1200/800",
        ],
    },
    {
        "name": "Koramangala Courtyard House",
        "location": "Koramangala, Bengaluru",
        "price": 29_900_000,
        "size_sqft": 2100,
        "bedrooms": 3,
        "description": (
            "A compact, design-forward home built around a central courtyard "
            "that brings natural light into every room. Close to Koramangala's "
            "cafe and tech hub, ideal for a young family wanting walkable "
            "convenience without compromising on privacy."
        ),
        "status": PropertyStatus.SOLD,
        "images": [
            "https://picsum.photos/id/1060/1200/800",
        ],
    },
]

SAMPLE_INQUIRIES = [
    {"name": "Asha Rao", "email": "asha.rao@example.com", "phone": "9876543210",
     "message": "Interested in scheduling a site visit this weekend. Is the property still available?"},
    {"name": "Vikram Shetty", "email": "vikram.shetty@example.com", "phone": "9845012345",
     "message": "Could you share the floor plan and details on the maintenance charges?"},
]


async def seed() -> None:
    async with async_session_maker() as session:
        from sqlalchemy import select

        existing = await session.execute(select(Property.id).limit(1))
        if existing.scalar_one_or_none() is not None:
            print("Seed data already present — skipping. (Delete rows manually to re-seed.)")
            return

        for prop_data in PROPERTIES:
            image_urls = prop_data.pop("images")
            prop = Property(**prop_data)
            prop.images = [
                PropertyImage(image_url=url, is_primary=(i == 0), display_order=i)
                for i, url in enumerate(image_urls)
            ]
            session.add(prop)
            await session.flush()  # get prop.id before creating inquiries

            for inquiry_data in SAMPLE_INQUIRIES:
                session.add(Inquiry(property_id=prop.id, **inquiry_data))

        await session.commit()
        print(f"Seeded {len(PROPERTIES)} properties with images and sample inquiries.")


if __name__ == "__main__":
    asyncio.run(seed())