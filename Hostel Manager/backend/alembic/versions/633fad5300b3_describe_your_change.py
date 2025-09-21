"""describe your change

Revision ID: 633fad5300b3
Revises: be112eb6a488
Create Date: 2025-08-22 17:03:55.053839

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '633fad5300b3'
down_revision: Union[str, Sequence[str], None] = 'be112eb6a488'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None
def upgrade() -> None:
    # Only ensure the StudentAdded FK exists
    with op.batch_alter_table("StudentAdded", schema=None) as batch_op:
        batch_op.create_foreign_key(
            "fk_studentadded_room_assignments",
            "room_assignments",
            ["room_assignment_id"],
            ["id"],
            ondelete="SET NULL"
        )
    # ⚠️ Removed the drop_constraint on room_assignments since SQLite doesn’t have it


def downgrade() -> None:
    # Drop the StudentAdded FK
    with op.batch_alter_table("StudentAdded", schema=None) as batch_op:
        batch_op.drop_constraint("fk_studentadded_room_assignments", type_="foreignkey")

    # ⚠️ Removed the recreate FK for room_assignments since it never existed in SQLite
