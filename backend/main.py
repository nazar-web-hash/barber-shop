from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.db import engine, Base, get_db
from database.models import Appointment
from schemas.appointment import AppointmentCreate, AppointmentResponse

# Автоматично створюємо таблиці в базі даних при запуску сервера
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BarberShop API")

# Налаштування безпеки (CORS), щоб фронтенд друга міг надсилати запити
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Коли друг викладе фронтенд, замінимо на його посилання
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "working", "message": "Бекенд барбершопу запущено!"}

# Маршрут для створення нового запису клієнта
@app.post("/api/book", response_model=AppointmentResponse)
def book_appointment(booking: AppointmentCreate, db: Session = Depends(get_db)):
    # Перевірка: чи не зайнятий цей час у цього майстра
    existing = db.query(Appointment).filter(
        Appointment.barber_name == booking.barber_name,
        Appointment.date == booking.date,
        Appointment.time == booking.time
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Цей час у майстра вже зайнятий!")

    # Створюємо запис у базі
    db_appointment = Appointment(
        client_name=booking.client_name,
        phone=booking.phone,
        barber_name=booking.barber_name,
        date=booking.date,
        time=booking.time
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

# Маршрут для перегляду всіх записів (для адмінки або майстрів)
@app.get("/api/bookings")
def get_all_bookings(db: Session = Depends(get_db)):
    return db.query(Appointment).all()
