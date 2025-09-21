"""add response column to complaints

Revision ID: b1f6b8e31279
Revises: d1dbc3425f60
Create Date: 2025-09-01 17:15:31.743428

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b1f6b8e31279'
down_revision: Union[str, Sequence[str], None] = 'd1dbc3425f60'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: add response column"""
    op.add_column('complaints', sa.Column('response', sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema: drop response column"""
    op.drop_column('complaints', 'response')
