"""make payments.adminId reference AdminCreate.email

Revision ID: 743c620585fb
Revises: 868c605e1e27
Create Date: 2025-09-04 02:32:16.691493
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '743c620585fb'
down_revision: Union[str, Sequence[str], None] = '868c605e1e27'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("payments", schema=None) as batch_op:
        batch_op.drop_column("adminId")   # remove old FK col
        batch_op.add_column(sa.Column("adminId", sa.String(), nullable=True))
        batch_op.create_foreign_key(
            "fk_payments_adminId_admincreate",  # 👈 explicit constraint name
            "AdminCreate",
            ["adminId"],
            ["email"]
        )


def downgrade() -> None:
    with op.batch_alter_table("payments", schema=None) as batch_op:
        batch_op.drop_constraint("fk_payments_adminId_admincreate", type_="foreignkey")
        batch_op.drop_column("adminId")
        batch_op.add_column(sa.Column("adminId", sa.String(), nullable=True))
        batch_op.create_foreign_key(
            "fk_payments_adminId_admincreate_id",
            "AdminCreate",
            ["adminId"],
            ["id"]
        )
