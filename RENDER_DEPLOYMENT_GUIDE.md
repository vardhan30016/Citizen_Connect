# Citizen Connect - Deployment Guide & Next Steps

Congratulations! As of our conversation, your application is **100% successfully deployed** on Render. 

* **Frontend URL**: [https://citizen-connect-3.onrender.com](https://citizen-connect-3.onrender.com)
* **Backend API Docs**: [https://citizen-connect-2.onrender.com/swagger-ui.html](https://citizen-connect-2.onrender.com/swagger-ui.html)

---

## ⚠️ Current Database Status (Important)
Right now, your application is using a **Temporary H2 Memory Database**. 
This means you can register users and test the app perfectly, but **if the server sleeps or restarts, all data will be deleted.** 

To make your data permanent, you must connect a Cloud Database.

---

## How to setup a Permanent Cloud Database

You do not need to write any SQL commands. Spring Boot will create the tables for you automatically! You just need an empty database in the cloud.

Choose **ONE** of the following options when you are ready:

### Option A: Keep using MySQL (Requires a 3rd Party Website)
1. Go to [Aiven.io](https://aiven.io/mysql) and sign up for a free account.
2. Create a Free MySQL Service.
3. They will give you a **Service URI** (It looks like `mysql://user:password@host:port/defaultdb`).
4. Go to your Render Dashboard -> Click `citizen-connect-2` (Backend) -> **Environment**.
5. Add these 3 Environment Variables:
   * `SPRING_DATASOURCE_URL`: `jdbc:mysql://[host]:[port]/[database_name]` (Extract this from your Aiven URI)
   * `SPRING_DATASOURCE_USERNAME`: Your Aiven username
   * `SPRING_DATASOURCE_PASSWORD`: Your Aiven password
6. Click **Save Changes**. Render will restart and your data is now permanent!

### Option B: Switch to PostgreSQL (Do it all inside Render)
If you don't want to use Aiven, Render offers free PostgreSQL databases. If you choose this, you must change your code first:
1. Open `pom.xml` and replace the MySQL dependency with:
   `<dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>`
2. Push that change to GitHub.
3. Go to your Render Dashboard and click **New +** -> **PostgreSQL** (Free tier).
4. Once it is created, copy the **"Internal Database URL"**.
5. Go to your Backend Service (`citizen-connect-2`) -> **Environment**.
6. Add these variables:
   * `SPRING_DATASOURCE_URL`: `jdbc:postgresql://[your-internal-url]`
   * `SPRING_DATASOURCE_USERNAME`: Your Render DB user
   * `SPRING_DATASOURCE_PASSWORD`: Your Render DB password
7. Click **Save Changes**.

---

## How to enable Email Features
If your app sends emails, go to your Backend Service (`citizen-connect-2`) -> **Environment** and add:
* `MAIL_USERNAME`: Your Gmail Address
* `MAIL_PASSWORD`: Your 16-character Gmail App Password
