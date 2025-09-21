"""add roomNo column to payments

Revision ID: 868c605e1e27
Revises: 19177b7d1637
Create Date: 2025-09-04 01:22:06.686442
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '868c605e1e27'
down_revision: Union[str, Sequence[str], None] = '19177b7d1637'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Only add roomNo column
    with op.batch_alter_table("payments", schema=None) as batch_op:
        batch_op.add_column(sa.Column("roomNo", sa.String(), nullable=True))


def downgrade() -> None:
    # Only remove roomNo column
    with op.batch_alter_table("payments", schema=None) as batch_op:
        batch_op.drop_column("roomNo")
