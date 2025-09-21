"""add resolvedBy column to complaints

Revision ID: 1a1497b45892
Revises: f738365fbab8
Create Date: 2025-09-04 16:45:14.393783

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a1497b45892'
down_revision: Union[str, Sequence[str], None] = 'f738365fbab8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: add resolvedBy column."""
    op.add_column(
        'complaints',
        sa.Column('resolvedBy', sa.String(), nullable=True)
    )


def downgrade() -> None:
    """Downgrade schema: remove resolvedBy column."""
    op.drop_column('complaints', 'resolvedBy')
