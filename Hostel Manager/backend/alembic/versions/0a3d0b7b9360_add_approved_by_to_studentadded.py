"""add approved_by to StudentAdded"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic
revision = '0a3d0b7b9360'
down_revision = 'f1c5bc082df5'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("StudentAdded", schema=None) as batch_op:
        batch_op.add_column(sa.Column("approved_by", sa.String(), server_default="Not yet approved"))


def downgrade():
    with op.batch_alter_table("StudentAdded", schema=None) as batch_op:
        batch_op.drop_column("approved_by")
