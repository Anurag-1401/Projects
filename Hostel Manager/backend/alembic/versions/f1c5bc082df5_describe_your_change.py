"""add student and roomNo to leave_applications, remove studentId column/FK

Revision ID: f1c5bc082df5
Revises: b1f6b8e31279
Create Date: 2025-09-01 17:52:00.768385
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f1c5bc082df5'
down_revision: Union[str, Sequence[str], None] = 'b1f6b8e31279'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None
def upgrade() -> None:
    with op.batch_alter_table("StudentAdded", schema=None) as batch_op:
        batch_op.drop_constraint("fk_studentadded_room_assignments", type_="foreignkey")

def downgrade() -> None:
    with op.batch_alter_table("StudentAdded", schema=None) as batch_op:
        batch_op.create_foreign_key(
            "fk_studentadded_room_assignments",
            "room_assignments",
            ["room_assignment_id"],
            ["id"],
        )

