"""fix category table references

Revision ID: 0ccbd9645cca
Revises: d21a4d542d43
Create Date: 2026-03-10 07:50:20.693481
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0ccbd9645cca"
down_revision: Union[str, Sequence[str], None] = "d21a4d542d43"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("fk_listing_category_id", "listing", type_="foreignkey")
    op.drop_constraint("fk_categories_parent_id", "categories", type_="foreignkey")

    op.rename_table("categories", "category")

    op.create_foreign_key(
        "fk_listing_category_id",
        "listing",
        "category",
        ["category_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "fk_category_parent_id",
        "category",
        "category",
        ["parent_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("fk_listing_category_id", "listing", type_="foreignkey")
    op.drop_constraint("fk_category_parent_id", "category", type_="foreignkey")

    op.rename_table("category", "categories")

    op.create_foreign_key(
        "fk_listing_category_id",
        "listing",
        "categories",
        ["category_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "fk_categories_parent_id",
        "categories",
        "categories",
        ["parent_id"],
        ["id"],
        ondelete="CASCADE",
    )