"""describe your change

Revision ID: be112eb6a488
Revises: 3dfa3d1db55f
Create Date: 2025-08-16 21:15:44.116913

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'be112eb6a488'
down_revision: Union[str, Sequence[str], None] = '3dfa3d1db55f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None
def upgrade() -> None:
    with op.batch_alter_table("rooms", recreate="always") as batch_op:
        batch_op.create_primary_key("pk_rooms", ["id"])  # only on id


def downgrade() -> None:
    with op.batch_alter_table("rooms", recreate="always") as batch_op:
        batch_op.create_primary_key("pk_rooms_roomNo", ["id", "roomNo"])  # restore composite PK
