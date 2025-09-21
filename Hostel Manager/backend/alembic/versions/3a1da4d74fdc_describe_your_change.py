from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3a1da4d74fdc'
down_revision = '2ecbd5800eb6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("attendances") as batch_op:
        batch_op.add_column(sa.Column("status", sa.String(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("attendances") as batch_op:
        batch_op.drop_column("status")
