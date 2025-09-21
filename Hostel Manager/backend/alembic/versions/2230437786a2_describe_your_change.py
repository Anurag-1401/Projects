"""add foreign key StudentCreate.authen_id -> StudentAdded.id

Revision ID: 2230437786a2
Revises: a960fed6a520
Create Date: 2025-08-25 19:18:23.970028

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2230437786a2'
down_revision: Union[str, Sequence[str], None] = 'a960fed6a520'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: add authen_id + FK in batch mode for SQLite."""
    with op.batch_alter_table("StudentCreate", schema=None) as batch_op:
        batch_op.add_column(sa.Column("authen_id", sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            "fk_studentcreate_studentadded",
            "StudentAdded",
            ["authen_id"],
            ["id"],
            ondelete="SET NULL"
        )


def downgrade() -> None:
    """Downgrade schema: remove authen_id + FK in batch mode."""
    with op.batch_alter_table("StudentCreate", schema=None) as batch_op:
        batch_op.drop_constraint("fk_studentcreate_studentadded", type_="foreignkey")
        batch_op.drop_column("authen_id")
