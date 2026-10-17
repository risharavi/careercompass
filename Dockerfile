FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy application files
COPY backend/ ./backend/
COPY static/ ./static/

ENV PORT=8000
EXPOSE 8000

CMD ["gunicorn", "--chdir", "backend", "app:app", "--bind", "0.0.0.0:8000"]
