from pydantic import BaseModel

class AppointmentCreate(BaseModel):
    client_name: str
    phone: str
    barber_name: str
    date: str
    time: str

class AppointmentResponse(AppointmentCreate):
    id: int

    class Config:
        from_attributes = True
    