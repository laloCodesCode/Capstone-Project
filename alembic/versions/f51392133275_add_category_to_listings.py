"""add category to listings

Revision ID: f51392133275
Revises: 01fb0bbfa301
Create Date: 2026-03-10 01:15:37.028603
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "f51392133275"
down_revision: Union[str, Sequence[str], None] = "01fb0bbfa301"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "listing",
        sa.Column("category_id", sa.UUID(), nullable=True),
    )
    op.create_foreign_key(
        "fk_listing_category_id",
        "listing",
        "categories",
        ["category_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_listing_category_id", "listing", type_="foreignkey")
    op.drop_column("listing", "category_id")