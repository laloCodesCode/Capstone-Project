# GenieMart ⚔️

> Senior Capstone

> Product By : Lily Nguyen, Eduardo Herrera-Barraza, Jared Martinez-Sanchez

## ⁉️About GenieMart

**🧞‍♂️What is GenieMart?**\
GenieMart is an online market place like Facebook market place but it is specifically made for the community of the University of North Carolina at Greensboro to provide students the security of shopping locally and selling their items to other students.

## 🫡 Team

| Name                    | Contribution                                                                                                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eduardo Herrera-Barraza | - Document Maintainer <br> - Backend(First Iteration) <br> - Frontend(UI) <br>&nbsp;&nbsp;&nbsp;&nbsp; - User interactive views(splash Screen, login/signup, profile settings) <br>&nbsp;&nbsp;&nbsp;&nbsp; - Admin interactive views <br> - Procurment of storage services |
| Lily Nguyen             | - Document Co-Maintainer <br> - Marketing Strategy <br> - Backend(First Iteration) <br> - Frontend(UI) <br>&nbsp;&nbsp;&nbsp;&nbsp; - User and Hardware interactive View(Main Listings page, More Info, and <br>&nbsp;&nbsp;&nbsp;&nbsp; Listings Creator)                  |
| Jared Martinez-Sanchez  | - Backend(Major Revamp and Final Iteration) <br> - Frontend(UI) <br>&nbsp;&nbsp;&nbsp;&nbsp; - interactive Messaging (API calls based Messaging) <br>&nbsp;&nbsp;&nbsp;&nbsp; - Major UI Cleanup <br> - Email Verification system setup                                     |

> [!IMPORTANT]
>
> we took a highly collaborative approach to our work loads everyone played a roll in all aspects of
> development all contributions outlined are the significant individual contributions!

## 🤩 Features

- Guaranteed Safety! Only users with verified accounts are permitted to sell and buy.
- Browse and Search listings by category or keyword
- Post your own items with up to 8 photos!
- Mange your profile! Whether you are a seller, shopper, or both!
- Built in private messaging between sellers and shoppers.

## 💻🛠️ Tech Stack

**🥸Backend development:**

- **Python**
  - **FastAPI** - Web framework
  - **SQLAlchemey** - ORM, type safe queries
  - **Pydantic** - Settings management
  - **JWT** - authentication
  - **Neon Serverless PostgreSQL Database** - Production database
  - **Dockerized PostgreSQL Database** - Development database
  - **Cloudflare R2** - Object/file storage
  - **Uvicorn** - local hosting web server (development/testing)

**👀 Frontend development:**

- **Typescript**
  - **React Native** - Cross platform UI framework
  - **Expo/Expo Router** - Development platform/tool provider and file based mobile app navigation
- **CSS** - UI styling

**🚀 Deployment:**

- **Render** - Backend hosting platfrom

## 🧑‍💻 Want to try it?

1. Clone the project on your machine.
2. Make sure you have Node and Python installed on your system.
3. Move into the frontend directory like so:

   ```bash
   cd frontend
   ```

4. Install the npm packages like so:

   ```bash
   npm install
   ```

5. Now that all packages are installed you may run the frontend and follow the CLI to launch the app like so:
   `bash
      npx expo start
      `
   > [!NOTE]
   > You do not need to run the backend as it is hosted on the render platform!

> [!WARNING]
> You must have an IOS/Andriod emulator installed to run the frontend on a laptop
> or PC. You can also use your own celular device to run it but you will need to install
> the expo app from the App Store or Google Play Store and follow the CLI to pipe
> the output to the device.
