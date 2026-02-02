import uuid
from sqlalchemy.orm import Session
from models.user import User
from models.reports import Reports
from schemas.user import UserCreate
from schemas.reports import ReportCreate

def create_report(db: Session, report: ReportCreate):
    db_report = Reports()


def get_report():
    pass


def get_report_by_user_id():
    pass


def get_report_by_email():
    pass


def get_reports():
    pass


# Presumably delete the report once the infraction has been handled
def delet_report():
    pass
