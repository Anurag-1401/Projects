"""describe your change

Revision ID: 8ab8b446d4e4
Revises: 2230437786a2
Create Date: 2025-08-26 16:18:34.748310

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8ab8b446d4e4'
down_revision: Union[str, Sequence[str], None] = '2230437786a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("StudentLogin", schema=None) as batch_op:
        batch_op.alter_column(
            "email",
            existing_type=sa.String(),
            nullable=False
        )
        batch_op.drop_index("ix_StudentLogin_email")  # remove unique index


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("StudentLogin", schema=None) as batch_op:
        batch_op.alter_column(
            "email",
            existing_type=sa.String(),
            nullable=True
        )
        batch_op.create_index(
            "ix_StudentLogin_email", ["email"], unique=True
        )
