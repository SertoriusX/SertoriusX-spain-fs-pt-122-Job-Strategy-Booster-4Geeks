"""merge heads para reparar historial

Revision ID: 76e781819a38
Revises: 7b2a93d4c6cc, 9d5bf3153aca
Create Date: 2026-01-27 22:53:07.353365

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '76e781819a38'
down_revision = ('7b2a93d4c6cc', '9d5bf3153aca')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
