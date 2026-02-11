import uuid


# NEEDED from the libraries 
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# NEEDED from the dev defined
from backend.app.crud import reports as c_report
from backend.app.schemas.reports import ReportCreate, ReportResponse
from backend.app.api.deps import get_db







#Instance 
router = APIRouter(prefix="/reports", tags=["reports"])


@router.post('/', response_model=ReportResponse)
def create_report(reports: ReportCreate, db: Session = Depends(get_db)):
    return c_report.create_report(db, reports)






@router.get("/", response_model =list[ReportResponse] )
def list_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return c_report.get_reports(db, skip=skip, limit=limit)



@router.get("/{report_id}", response_model = ReportResponse)
def read_report(report_id: uuid.UUID, db: Session = Depends(get_db)):
    db_report = c_report.get_report(db, report_id)
    if not db_report:
        raise HTTPException(status_code=404, details= "Infraction not found!")
    return db_report




@router.get("/{report_id}", response_model = ReportResponse)
def delete_report(report_id: uuid.UUID, db: Session = Depends(get_db)):
    db_report = c_report.delete_report(db, report_id)
    if not db_report:
        raise HTTPException(status_code=404, detail="Infraction not found!")
    return db_report


