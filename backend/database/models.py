from sqlalchemy import Column, Integer, String
from .db import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, index=True)
    phone = Column(String, index=True)
    barber_name = Column(String)
    date = Column(String)
    time = Column(String)