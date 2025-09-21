"""describe your change

Revision ID: d1dbc3425f60
Revises: 26b02d62479f
Create Date: 2025-09-01 16:41:36.400125

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd1dbc3425f60'
down_revision: Union[str, Sequence[str], None] = '26b02d62479f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("complaints", schema=None) as batch_op:
        batch_op.drop_constraint("fk_complaints_studentadded", type_="foreignkey")
        batch_op.drop_column("student_id")
        batch_op.add_column(sa.Column("student_name", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("room_no", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("complaints", schema=None) as batch_op:
        batch_op.drop_column("room_no")
        batch_op.drop_column("student_name")
        batch_op.add_column(sa.Column("student_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_complaints_studentadded",
            "StudentAdded",
            ["student_id"],
            ["id"]
        )
