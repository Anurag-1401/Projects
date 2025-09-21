"""add feesDue column in StudentAdded

Revision ID: b3b38428d31c
Revises: 7a736f8a6051
Create Date: 2025-09-11 15:42:27.044528

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b3b38428d31c'
down_revision: Union[str, Sequence[str], None] = '7a736f8a6051'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("StudentAdded", recreate="always") as batch_op:
        batch_op.alter_column("feesDue",
            existing_type=sa.Boolean(),
            type_=sa.Date(),
            existing_nullable=True
        )


def downgrade() -> None:
    with op.batch_alter_table("StudentAdded", schema=None) as batch_op:
        batch_op.drop_column("feesDue")
