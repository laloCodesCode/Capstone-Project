"""remove unique constraint from categories name

Revision ID: d21a4d542d43
Revises: 05dc98733c95
Create Date: 2026-03-10 07:39:45.068138

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd21a4d542d43'
down_revision: Union[str, Sequence[str], None] = '05dc98733c95'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.drop_constraint(
        "categories_name_key",
        "categories",
        type_="unique"
    )

def downgrade():
    op.create_unique_constraint(
        "categories_name_key",
        "categories",
        ["name"]
    )