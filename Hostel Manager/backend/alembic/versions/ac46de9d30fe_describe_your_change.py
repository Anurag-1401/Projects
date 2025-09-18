from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "ac46de9d30fe"
down_revision = "589370d949fd"
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema: add complaints.priority and fix student_id FK."""
    with op.batch_alter_table("complaints") as batch_op:
        batch_op.add_column(sa.Column("priority", sa.String(), nullable=True))
        batch_op.alter_column(
            "student_id",
            existing_type=sa.VARCHAR(),
            type_=sa.Integer(),
            existing_nullable=True,
        )
        batch_op.create_foreign_key(
            "fk_complaints_studentadded",  # give it a name
            "StudentAdded",
            ["student_id"],
            ["id"],
        )


def downgrade() -> None:
    """Downgrade schema: remove complaints.priority and FK."""
    with op.batch_alter_table("complaints") as batch_op:
        batch_op.drop_constraint("fk_complaints_studentadded", type_="foreignkey")
        batch_op.alter_column(
            "student_id",
            existing_type=sa.Integer(),
            type_=sa.VARCHAR(),
            existing_nullable=True,
        )
        batch_op.drop_column("priority")
