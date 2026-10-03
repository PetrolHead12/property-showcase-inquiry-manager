"""initial schema: properties, property_images, inquiries

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-10-02
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


property_status_enum = sa.Enum(
    "available",
    "under_offer",
    "sold",
    name="property_status",
)


def upgrade() -> None:
  

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    op.create_table(
        "properties",
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            autoincrement=True,
        ),
        sa.Column(
            "name",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "location",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "price",
            sa.Numeric(14, 2),
            nullable=False,
        ),
        sa.Column(
            "size_sqft",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "bedrooms",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "status",
            property_status_enum,
            nullable=False,
            server_default="available",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.CheckConstraint(
            "price > 0",
            name="ck_properties_price_positive",
        ),
        sa.CheckConstraint(
            "size_sqft > 0",
            name="ck_properties_size_positive",
        ),
        sa.CheckConstraint(
            "bedrooms >= 0",
            name="ck_properties_bedrooms_nonneg",
        ),
    )

    op.create_index(
        "ix_properties_location",
        "properties",
        ["location"],
    )

    op.create_index(
        "ix_properties_bedrooms",
        "properties",
        ["bedrooms"],
    )

    # ------------------------------------------------------------------
    # Property Images
    # ------------------------------------------------------------------

    op.create_table(
        "property_images",
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            autoincrement=True,
        ),
        sa.Column(
            "property_id",
            sa.Integer(),
            sa.ForeignKey(
                "properties.id",
                ondelete="CASCADE",
            ),
            nullable=False,
        ),
        sa.Column(
            "image_url",
            sa.String(length=1024),
            nullable=False,
        ),
        sa.Column(
            "is_primary",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
        sa.Column(
            "display_order",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    op.create_index(
        "ix_property_images_property_id",
        "property_images",
        ["property_id"],
    )

    # ------------------------------------------------------------------
    # Inquiries
    # ------------------------------------------------------------------

    op.create_table(
        "inquiries",
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            autoincrement=True,
        ),
        sa.Column(
            "property_id",
            sa.Integer(),
            sa.ForeignKey(
                "properties.id",
                ondelete="RESTRICT",
            ),
            nullable=False,
        ),
        sa.Column(
            "name",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "email",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "phone",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "message",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    op.create_index(
        "ix_inquiries_property_id",
        "inquiries",
        ["property_id"],
    )

    op.create_index(
        "ix_inquiries_created_at",
        "inquiries",
        ["created_at"],
    )


def downgrade() -> None:
    # Drop inquiries first because they reference properties.
    op.drop_index(
        "ix_inquiries_created_at",
        table_name="inquiries",
    )

    op.drop_index(
        "ix_inquiries_property_id",
        table_name="inquiries",
    )

    op.drop_table("inquiries")

    # Drop property images before properties.
    op.drop_index(
        "ix_property_images_property_id",
        table_name="property_images",
    )

    op.drop_table("property_images")

    op.drop_index(
        "ix_properties_bedrooms",
        table_name="properties",
    )

    op.drop_index(
        "ix_properties_location",
        table_name="properties",
    )

    op.drop_table("properties")

    property_status_enum.drop(
        op.get_bind(),
        checkfirst=True,
    )