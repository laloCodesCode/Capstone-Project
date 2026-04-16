from uuid import UUID

from sqlalchemy.orm import Session

from backend.app.models.report import Report
from backend.app.schemas.report import ReportCreate


def create_report(db: Session, reporter_id: UUID, payload: ReportCreate) -> Report:
    report = Report(
        reporter_id=reporter_id,
        listing_id=payload.listing_id,
        reason=payload.reason,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def get_all_reports(db: Session) -> list[Report]:
    return db.query(Report).order_by(Report.created_at.desc()).all()


def get_report(db: Session, report_id: UUID) -> Report | None:
    return db.get(Report, report_id)


def delete_report(db: Session, report: Report) -> None:
    db.delete(report)
    db.commit()
