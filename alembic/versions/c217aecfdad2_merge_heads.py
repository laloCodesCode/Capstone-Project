"""merge heads

Revision ID: c217aecfdad2
Revises: 11166786fd78, 9f4e87f35887
Create Date: 2026-04-14 18:39:15.675336

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c217aecfdad2'
down_revision: Union[str, Sequence[str], None] = ('11166786fd78', '9f4e87f35887')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
