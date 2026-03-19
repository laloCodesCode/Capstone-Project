"""update listing image fields

Revision ID: b04c9c5e810f
Revises: 0ccbd9645cca
Create Date: 2026-03-10 23:32:45.410202

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b04c9c5e810f'
down_revision: Union[str, Sequence[str], None] = '0ccbd9645cca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("listing_image", "url", new_column_name="image_url")
    op.add_column(
        "listing_image",
        sa.Column("is_primary", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.alter_column("listing_image", "is_primary", server_default=None)


def downgrade() -> None:
    op.drop_column("listing_image", "is_primary")
    op.alter_column("listing_image", "image_url", new_column_name="url")