"""describe your change

Revision ID: 589370d949fd
Revises: 3a1da4d74fdc
Create Date: 2025-08-29 21:49:25.324919

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '589370d949fd'
down_revision: Union[str, Sequence[str], None] = '3a1da4d74fdc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("attendances") as batch_op:
        batch_op.add_column(sa.Column("warning", sa.Integer(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("attendances") as batch_op:
        batch_op.drop_column("warning")
