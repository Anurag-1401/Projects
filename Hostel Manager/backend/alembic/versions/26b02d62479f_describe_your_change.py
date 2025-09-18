from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "26b02d62479f"
down_revision: str = "ac46de9d30fe"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Add default value to complaints.status"""
    with op.batch_alter_table("complaints") as batch_op:
        batch_op.alter_column(
            "status",
            existing_type=sa.String(),
            server_default="pending",  # 👈 set your default here
            existing_nullable=True,
        )


def downgrade() -> None:
    """Remove default value from complaints.status"""
    with op.batch_alter_table("complaints") as batch_op:
        batch_op.alter_column(
            "status",
            existing_type=sa.String(),
            server_default=None,
            existing_nullable=True,
        )
