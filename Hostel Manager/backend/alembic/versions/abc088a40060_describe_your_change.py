"""remove old columns from leave_applications

Revision ID: b12f3e45c7a8
Revises: f67fa585fbf9
Create Date: 2025-09-02 18:25:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b12f3e45c7a8'
down_revision: Union[str, Sequence[str], None] = 'f67fa585fbf9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Drop old columns from leave_applications"""
    with op.batch_alter_table("leave_applications", schema=None) as batch_op:
        batch_op.drop_column("student_name")
        batch_op.drop_column("room_no")
        batch_op.drop_column("remarks")
        batch_op.drop_column("student_id")


def downgrade() -> None:
    """Re-add old columns if downgrade needed"""
    with op.batch_alter_table("leave_applications", schema=None) as batch_op:
        batch_op.add_column(sa.Column("student_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("remarks", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("room_no", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("student_name", sa.String(), nullable=True))
