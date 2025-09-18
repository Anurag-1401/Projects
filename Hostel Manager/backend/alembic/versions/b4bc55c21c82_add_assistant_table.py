"""add Assistant table

Revision ID: b4bc55c21c82
Revises: b3b38428d31c
Create Date: 2025-09-16 21:55:51.376692

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b4bc55c21c82'
down_revision: Union[str, Sequence[str], None] = 'b3b38428d31c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'assistant',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('student', sa.String(), sa.ForeignKey('StudentCreate.email')),
        sa.Column('question', sa.String(), nullable=False),
        sa.Column('response', sa.String(), nullable=True),
        sa.Column('createdAt', sa.DateTime(), nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)')),
        sa.Column('updatedAt', sa.DateTime(), nullable=False, server_default=sa.text('(CURRENT_TIMESTAMP)'))
    )


def downgrade() -> None:
    op.drop_table('assistant')
