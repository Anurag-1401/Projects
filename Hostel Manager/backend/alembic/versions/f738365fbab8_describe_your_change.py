"""add response column to leave_applications

Revision ID: f738365fbab8
Revises: b12f3e45c7a8
Create Date: 2025-09-02 16:15:57.880196
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f738365fbab8'
down_revision: Union[str, Sequence[str], None] = 'b12f3e45c7a8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('leave_applications', sa.Column('response', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('leave_applications', 'response')
