"""add adminId column to payments with FK to AdminCreate.id

Revision ID: 19177b7d1637
Revises: fba9021793e2
Create Date: 2025-09-04 01:10:47.694811
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '19177b7d1637'
down_revision: Union[str, Sequence[str], None] = 'fba9021793e2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use batch mode for SQLite support
    with op.batch_alter_table("payments", schema=None) as batch_op:
        batch_op.add_column(sa.Column('adminId', sa.String(), nullable=True))
        batch_op.create_foreign_key(
            "fk_payments_adminId",      # constraint name
            "AdminCreate",              # referent table
            ["adminId"],                # local column
            ["id"]                      # remote column
        )


def downgrade() -> None:
    with op.batch_alter_table("payments", schema=None) as batch_op:
        batch_op.drop_constraint("fk_payments_adminId", type_="foreignkey")
        batch_op.drop_column("adminId")
