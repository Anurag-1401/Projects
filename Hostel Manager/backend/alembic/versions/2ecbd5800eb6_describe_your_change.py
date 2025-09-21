"""describe your change

Revision ID: 2ecbd5800eb6
Revises: 0beff9570fd5
Create Date: 2025-08-26 23:07:02.951719

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2ecbd5800eb6'
down_revision: Union[str, Sequence[str], None] = '0beff9570fd5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Rename column locatiom → location
    op.alter_column("attendances", "locatiom", new_column_name="location")
    

def downgrade() -> None:
    # Revert location → locatiom
    op.alter_column("attendances", "location", new_column_name="locatiom")
