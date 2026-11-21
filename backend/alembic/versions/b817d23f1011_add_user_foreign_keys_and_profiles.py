"""add_user_foreign_keys_and_profiles

Revision ID: b817d23f1011
Revises: 571892cca222
Create Date: 2026-11-22 01:41:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b817d23f1011'
down_revision: Union[str, Sequence[str], None] = '571892cca222'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    # 1. Create users table if not exists
    if 'users' not in tables:
        op.create_table(
            'users',
            sa.Column('id', sa.String(length=64), nullable=False),
            sa.Column('email', sa.String(length=255), nullable=False),
            sa.Column('preferred_language', sa.String(length=10), nullable=False, server_default='en'),
            sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
            sa.PrimaryKeyConstraint('id'),
        )
        op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
        op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Add user_id column and foreign key to user-owned clinical tables if not present
    for table_name in ['sessions', 'lab_reports', 'idrs_assessments', 'triage_assessments', 'medication_checks', 'health_summaries']:
        columns = [c['name'] for c in inspector.get_columns(table_name)]
        if 'user_id' not in columns:
            ondelete = 'SET NULL' if table_name == 'sessions' else 'CASCADE'
            with op.batch_alter_table(table_name) as batch_op:
                batch_op.add_column(sa.Column('user_id', sa.String(length=64), nullable=True))
                batch_op.create_foreign_key(f'fk_{table_name}_user_id', 'users', ['user_id'], ['id'], ondelete=ondelete)


def downgrade() -> None:
    with op.batch_alter_table('health_summaries') as batch_op:
        batch_op.drop_column('user_id')

    with op.batch_alter_table('medication_checks') as batch_op:
        batch_op.drop_column('user_id')

    with op.batch_alter_table('triage_assessments') as batch_op:
        batch_op.drop_column('user_id')

    with op.batch_alter_table('idrs_assessments') as batch_op:
        batch_op.drop_column('user_id')

    with op.batch_alter_table('lab_reports') as batch_op:
        batch_op.drop_column('user_id')

    with op.batch_alter_table('sessions') as batch_op:
        batch_op.drop_column('user_id')

    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')
