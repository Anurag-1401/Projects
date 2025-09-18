from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect, String
from alembic import op

# revision identifiers
revision: str = '2d08c6ca5d76'
down_revision: Union[str, Sequence[str], None] = '633fad5300b3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    insp = inspect(bind)
    columns = [col["name"] for col in insp.get_columns("visitor_logs")]

    with op.batch_alter_table("visitor_logs", schema=None) as batch_op:
        # only add student_email if it doesn't already exist
        if "student_email" not in columns:
            batch_op.add_column(op.f("student_email"), String(), nullable=True)

        # create FK only if not already existing
        batch_op.create_foreign_key(
            "fk_visitor_student",
            "StudentCreate",
            ["student_email"],
            ["email"]
        )



def downgrade() -> None:
    with op.batch_alter_table("visitor_logs", schema=None) as batch_op:
        batch_op.add_column(sa.Column("purpose", sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column("id_number", sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column("student_id", sa.VARCHAR(), nullable=True))
        batch_op.add_column(sa.Column("id_proof", sa.VARCHAR(), nullable=True))

        batch_op.drop_constraint("fk_visitor_student", type_="foreignkey")
        batch_op.drop_column("student_email")
