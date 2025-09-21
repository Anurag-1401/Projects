"""add student and roomNo columns to leave_applications

Revision ID: f67fa585fbf9
Revises: 0a3d0b7b9360
Create Date: 2025-09-02 15:42:52.380335
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f67fa585fbf9'
down_revision: Union[str, Sequence[str], None] = '0a3d0b7b9360'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: add student + roomNo to leave_applications"""
    with op.batch_alter_table("leave_applications", schema=None) as batch_op:
        batch_op.add_column(sa.Column("student", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("roomNo", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema: remove student + roomNo from leave_applications"""
    with op.batch_alter_table("leave_applications", schema=None) as batch_op:
        batch_op.drop_column("roomNo")
        batch_op.drop_column("student")
