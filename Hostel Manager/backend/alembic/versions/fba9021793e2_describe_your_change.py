"""update payments schema

Revision ID: fba9021793e2
Revises: 1a1497b45892
Create Date: 2025-09-04 01:01:51.122012
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'fba9021793e2'
down_revision: Union[str, Sequence[str], None] = '1a1497b45892'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

from sqlalchemy import inspect

def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    columns = [col["name"] for col in inspector.get_columns("payments")]

    if "studentId" not in columns:
        op.add_column("payments", sa.Column("studentId", sa.Integer(), nullable=True))

    if "studentName" not in columns:
        op.add_column("payments", sa.Column("studentName", sa.String(), nullable=True))

    if "paymentType" not in columns:
        op.add_column("payments", sa.Column("paymentType", sa.String(), nullable=True))

    if "remarks" not in columns:
        op.add_column("payments", sa.Column(
            "remarks", sa.String(), server_default="not yet responded", nullable=False
        ))

    if "createdAt" not in columns:
        op.add_column("payments", sa.Column("createdAt", sa.DateTime(), nullable=True))

    if "updatedAt" not in columns:
        op.add_column("payments", sa.Column("updatedAt", sa.DateTime(), nullable=True))

    with op.batch_alter_table("payments", schema=None, reflect_kwargs={"resolve_fks": False}) as batch_op:
        batch_op.alter_column("date",
            existing_type=sa.DateTime(),
            type_=sa.Date(),
            existing_nullable=True
        )
        if "method" in columns:
            batch_op.drop_column("method")
        if "signature" in columns:
            batch_op.drop_column("signature")
        if "orderId" in columns:
            batch_op.drop_column("orderId")
        if "workerId" in columns:
            batch_op.drop_column("workerId")

        # only create FK if it doesn’t already exist
        batch_op.create_foreign_key(
            "fk_payments_studentId", "StudentAdded", ["studentId"], ["id"]
        )



def downgrade() -> None:
    with op.batch_alter_table("payments", schema=None, reflect_kwargs={"resolve_fks": False}) as batch_op:
        batch_op.add_column(sa.Column('workerId', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('orderId', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('signature', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('method', sa.String(), nullable=True))
        batch_op.alter_column('date',
            existing_type=sa.Date(),
            type_=sa.DateTime(),
            existing_nullable=True
        )
        batch_op.drop_constraint("fk_payments_studentId", type_="foreignkey")

    op.drop_column('payments', 'updatedAt')
    op.drop_column('payments', 'createdAt')
    op.drop_column('payments', 'remarks')
    op.drop_column('payments', 'paymentType')
    op.drop_column('payments', 'studentName')
    op.drop_column('payments', 'studentId')
