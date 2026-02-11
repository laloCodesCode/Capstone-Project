import uuid

from sqlalchemy.orm import Session
from backend.app.schemas.reports import ReportResponse
from backend.app.schemas.reports import ReportCreate




"""
This reports the listing but fucntionally reports the user as
well !
"""











def create_report(db: Session, report: ReportCreate):
    db_report = ReportCreate(
        user_id = report.user_id, listing_id=report.listing_id, decription=report.description
    )
    db.add(db_report)
    db.commit()
    db.refersh(db_report)
    return db_report



def get_report(db: Session, report_id: uuid.UUID):
    return db.query(ReportResponse).filter(ReportResponse.report_id==report_id).first()




def get_reports(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ReportResponse).offset(skip).limit(limit).all()

def delete_report(db: Session, report_id: uuid.UUID):
    report = db.query(ReportResponse).filter(ReportResponse.report_id==report_id).first()
    if not report:
        return None 



    db.delete(report)
    db.commit()
    return report
