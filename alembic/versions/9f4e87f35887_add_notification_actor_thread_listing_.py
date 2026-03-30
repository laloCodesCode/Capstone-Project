"""add notification actor thread listing fields

Revision ID: 9f4e87f35887
Revises: 3b64a72586da
Create Date: 2026-03-26 16:45:34.633278
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9f4e87f35887"
down_revision: Union[str, Sequence[str], None] = "3b64a72586da"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("notification", sa.Column("actor_user_id", sa.Uuid(), nullable=True))
    op.add_column("notification", sa.Column("thread_id", sa.Uuid(), nullable=True))
    op.add_column("notification", sa.Column("listing_id", sa.Uuid(), nullable=True))

    op.create_foreign_key(
        "fk_notification_actor_user_id",
        "notification",
        "user",
        ["actor_user_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_foreign_key(
        "fk_notification_thread_id",
        "notification",
        "message_thread",
        ["thread_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "fk_notification_listing_id",
        "notification",
        "listing",
        ["listing_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("fk_notification_listing_id", "notification", type_="foreignkey")
    op.drop_constraint("fk_notification_thread_id", "notification", type_="foreignkey")
    op.drop_constraint("fk_notification_actor_user_id", "notification", type_="foreignkey")

    op.drop_column("notification", "listing_id")
    op.drop_column("notification", "thread_id")
    op.drop_column("notification", "actor_user_id")