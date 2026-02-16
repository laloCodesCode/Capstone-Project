from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg://postgres:postgres@localhost:5433/geniemart")
conn = engine.connect()
print("Connected!")
