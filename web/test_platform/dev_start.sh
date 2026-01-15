#!/bin/bash

# Start Backend
echo "Starting Backend..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Services started. Backend PID: $BACKEND_PID, Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both services."

# Wait for both processes
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT
wait
