"""add cascade delete to message_thread user fks

Revision ID: 3b64a72586da
Revises: 4f8ed00ffb43
Create Date: 2026-03-18 23:06:49.500058

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3b64a72586da'
down_revision: Union[str, Sequence[str], None] = '4f8ed00ffb43'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # drop old constraints
    op.drop_constraint('message_thread_buyer_id_fkey', 'message_thread', type_='foreignkey')
    op.drop_constraint('message_thread_seller_id_fkey', 'message_thread', type_='foreignkey')

    # recreate with proper names + CASCADE
    op.create_foreign_key(
        'message_thread_seller_id_fkey',
        'message_thread',
        'user',
        ['seller_id'],
        ['id'],
        ondelete='CASCADE'
    )

    op.create_foreign_key(
        'message_thread_buyer_id_fkey',
        'message_thread',
        'user',
        ['buyer_id'],
        ['id'],
        ondelete='CASCADE'
    )

def downgrade() -> None:
    op.drop_constraint('message_thread_seller_id_fkey', 'message_thread', type_='foreignkey')
    op.drop_constraint('message_thread_buyer_id_fkey', 'message_thread', type_='foreignkey')

    op.create_foreign_key(
        'message_thread_seller_id_fkey',
        'message_thread',
        'user',
        ['seller_id'],
        ['id']
    )

    op.create_foreign_key(
        'message_thread_buyer_id_fkey',
        'message_thread',
        'user',
        ['buyer_id'],
        ['id']
    )