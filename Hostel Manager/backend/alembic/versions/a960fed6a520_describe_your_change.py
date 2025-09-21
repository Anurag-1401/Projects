"""describe your change

Revision ID: a960fed6a520
Revises: 2d08c6ca5d76
Create Date: 2025-08-24 15:31:31.853975
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a960fed6a520'
down_revision: Union[str, Sequence[str], None] = '2d08c6ca5d76'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # get current columns
    columns = [col['name'] for col in inspector.get_columns('visitor_logs')]

    with op.batch_alter_table("visitor_logs", schema=None) as batch_op:
        batch_op.add_column(sa.Column('student_name', sa.String(), nullable=True))

        if 'purpose' in columns:
            batch_op.drop_column('purpose')
        if 'student_id' in columns:
            batch_op.drop_column('student_id')
        if 'id_number' in columns:
            batch_op.drop_column('id_number')


def downgrade() -> None:
    """Downgrade schema."""

    with op.batch_alter_table("visitor_logs", schema=None) as batch_op:
        # re-add old columns
        batch_op.add_column(sa.Column('id_number', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('student_id', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('purpose', sa.String(), nullable=True))

        # remove new column
        batch_op.drop_column('student_name')
