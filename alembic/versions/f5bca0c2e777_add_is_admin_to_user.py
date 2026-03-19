"""add is_admin to user

Revision ID: f5bca0c2e777
Revises: b04c9c5e810f
Create Date: 2026-03-11 12:41:23.762422

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f5bca0c2e777'
down_revision: Union[str, Sequence[str], None] = 'b04c9c5e810f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "user",
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default="false"),
    )

def downgrade():
    op.drop_column("user", "is_admin")