"""users table

Revision ID: 26f4bbc24425
Revises: 
Create Date: 2019-12-03 17:46:36.684817

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '26f4bbc24425'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=100), nullable=True),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('password_hash', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.create_table('to_do',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=True),
    sa.Column('tag', sa.String(length=100), nullable=True),
    sa.Column('body', sa.Text(), nullable=True),
    sa.Column('start_date', sa.DateTime(), nullable=True),
    sa.Column('due_date', sa.DateTime(), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_to_do_completed'), 'to_do', ['completed'], unique=False)
    op.create_index(op.f('ix_to_do_due_date'), 'to_do', ['due_date'], unique=False)
    op.create_index(op.f('ix_to_do_tag'), 'to_do', ['tag'], unique=False)
    op.create_index(op.f('ix_to_do_title'), 'to_do', ['title'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_to_do_title'), table_name='to_do')
    op.drop_index(op.f('ix_to_do_tag'), table_name='to_do')
    op.drop_index(op.f('ix_to_do_due_date'), table_name='to_do')
    op.drop_index(op.f('ix_to_do_completed'), table_name='to_do')
    op.drop_table('to_do')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###
