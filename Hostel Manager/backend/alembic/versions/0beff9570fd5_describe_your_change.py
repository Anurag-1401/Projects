"""describe your change

Revision ID: 0beff9570fd5
Revises: 8ab8b446d4e4
Create Date: 2025-08-26 22:33:49.911203

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0beff9570fd5'
down_revision: Union[str, Sequence[str], None] = '8ab8b446d4e4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("attendances", schema=None) as batch_op:
        batch_op.add_column(sa.Column("name", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("email", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("locatiom", sa.String(), nullable=True))  # typo? maybe 'location'
        batch_op.add_column(sa.Column("image", sa.String(), nullable=True))
        batch_op.add_column(sa.Column("roomNo", sa.String(), nullable=True))
        batch_op.alter_column(
            "date",
            existing_type=sa.DATE(),
            type_=sa.DateTime(),
            existing_nullable=False,
        )
        batch_op.drop_column("status")   # remove old column


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("attendances", schema=None) as batch_op:
        batch_op.add_column(sa.Column("status", sa.String(), nullable=False))
        batch_op.alter_column(
            "date",
            existing_type=sa.DateTime(),
            type_=sa.DATE(),
            existing_nullable=False,
        )
        batch_op.drop_column("roomNo")
        batch_op.drop_column("image")
        batch_op.drop_column("locatiom")
        batch_op.drop_column("email")
        batch_op.drop_column("name")
