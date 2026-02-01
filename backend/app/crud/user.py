"""
CREATE : Create a new user, by deafult "USER"
READ: Look at a certain user or a collection of users
UPDATE: Change a couple aspects of the user
DELETE: Remove a user
"""
import uuid 
from sqlalchemy.orm import Session
from models.user import user
from schemas.user import UserCreate

# New user
def create_user():
    pass

# Get specific user by default using their ID
def get_user():
    pass

# Get specific user by email
def get_user_by_email():
    pass

# Get a collection of users
def get_users():
    pass


