"""describe your change

Revision ID: 3dfa3d1db55f
Revises: 59e1d38614c1
Create Date: 2025-08-16 15:40:38.882638

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3dfa3d1db55f'
down_revision: Union[str, Sequence[str], None] = '59e1d38614c1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Change FK to reference AdminCreate.email instead of id"""
    with op.batch_alter_table("room_assignments") as batch_op:
        batch_op.create_foreign_key(
            "fk_room_assignments_assignedBy_email",  # give a unique name
            "AdminCreate",                          # target table
            ["assignedBy"],                         # local column
            ["email"]                               # target column
        )

def downgrade() -> None:
    """Revert FK back to reference AdminCreate.id"""
    with op.batch_alter_table("room_assignments") as batch_op:
        batch_op.create_foreign_key(
            "fk_room_assignments_assignedBy_id",
            "AdminCreate",
            ["assignedBy"],
            ["id"]
        )
