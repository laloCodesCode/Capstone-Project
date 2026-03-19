"""add is_banned to user

Revision ID: 0f3ee3b1d6b5
Revises: f5bca0c2e777
Create Date: 2026-03-11 13:43:02.542252

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0f3ee3b1d6b5'
down_revision: Union[str, Sequence[str], None] = 'f5bca0c2e777'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "user",
        sa.Column(
            "is_banned",
            sa.Boolean(),
            nullable=False,
            server_default="false",
        ),
    )
def downgrade():
    op.drop_column("user", "is_banned")