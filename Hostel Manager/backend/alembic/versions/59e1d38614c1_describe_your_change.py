"""describe your change

Revision ID: 59e1d38614c1
Revises: b0a0a5d03339
Create Date: 2025-08-16 15:32:46.443868

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '59e1d38614c1'
down_revision: Union[str, Sequence[str], None] = 'b0a0a5d03339'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    with op.batch_alter_table('room_assignments') as batch_op:
        # Drop the column safely in SQLite
        batch_op.drop_column('roomId')
        # If you need to drop or create a FK, do it inside batch_op
        # batch_op.drop_constraint("fk_name", type_="foreignkey")
        # batch_op.create_foreign_key("fk_name", "rooms", ["roomId"], ["id"])
def downgrade():
    with op.batch_alter_table('room_assignments') as batch_op:
        batch_op.add_column(sa.Column('roomId', sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key("fk_roomId", "rooms", ["roomId"], ["id"])