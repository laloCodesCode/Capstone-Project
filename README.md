# Table of Content
Frontend



Backend




# GenieMart 🍳

> Senior Capstone

> Product By : Lily Nguyen, Eduardo Herrera-Barraza, Jared Martinez-Sanchez

# About GenieMart


# Setup / How to Run
- Requirnemnts :
  - Python 3.14+
  - Node.js 
  - Expo Go on personal device and or IOS/Android emulator
- **Backend setup (Done in the genral project folder)**
  - setup the .venv mod
  ```
  python3 -m venv .ven
  source .venv/bin/activate
  ```
  - Install pip dependencies
  ```
  pip install -r requirnments.txt
  ```
  - Run the backend 
  ```
  uvicorn backend.app.main:app --reload --host 0.0.0.0 --port
  ```
- **Frontend**
  - Move into the frontend directory 
  ```
  cd frontend
  ```
 - Install the node dependencies 
 ```
 npm i 
 ```
 - Run the expo project
 ```
 npx expo start
 ```
 - Follow the CLI for instructions on how to render the views
