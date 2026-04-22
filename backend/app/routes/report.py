from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.dependency import get_admin_user, get_verified_user
from backend.app.crud.report import (
    create_report,
    delete_report,
    get_all_reports,
    get_report,
)
from backend.app.db.dependencies import get_db
from backend.app.models.listing import Listing
from backend.app.models.user import User
from backend.app.schemas.report import ReportCreate, ReportResponse

report_router = APIRouter(prefix="/report", tags=["report"])


# Any verified user can submit a report
@report_router.post("/", response_model=ReportResponse)
def submit_report(
    payload: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_verified_user),
):
    return create_report(db=db, reporter_id=current_user.id, payload=payload)


# # Admin only — view all reports
# @report_router.get("/", response_model=list[ReportResponse])
# def get_reports(
#     db: Session = Depends(get_db),
#     current_admin: User = Depends(get_admin_user),
# ):
#     return get_all_reports(db)
@report_router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    reports = get_all_reports(db)
    result = []
    for report in reports:
        listing = db.get(Listing, report.listing_id)
        result.append(
            {
                "id": str(report.id),
                "reporter_id": str(report.reporter_id),
                "listing_id": str(report.listing_id),
                "listing_title": listing.title if listing else "Deleted Listing",
                "reason": report.reason,
                "created_at": report.created_at,
            }
        )
    return result


# Admin only — delete a report
@report_router.delete("/{report_id}")
def remove_report(
    report_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_admin_user),
):
    report = get_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    delete_report(db, report)
    return {"message": "Report deleted"}
