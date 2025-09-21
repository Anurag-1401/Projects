"""change payments.date to DateTime

Revision ID: 7a736f8a6051
Revises: 743c620585fb
Create Date: 2025-09-04 02:43:08.728370
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7a736f8a6051'
down_revision: Union[str, Sequence[str], None] = '743c620585fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    with op.batch_alter_table("payments", schema=None) as batch_op:
        batch_op.alter_column(
            "date",
            existing_type=sa.DATE(),
            type_=sa.DateTime(),
            existing_nullable=True
        )

def downgrade() -> None:
    with op.batch_alter_table("payments", schema=None) as batch_op:
        batch_op.alter_column(
            "date",
            existing_type=sa.DateTime(),
            type_=sa.DATE(),
            existing_nullable=True
        )
