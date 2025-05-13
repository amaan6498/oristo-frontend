# Task Management App Documentation

---

## 2.1.3.1. Overview of What is Being Built

The **Task Management App** is a _modern, web-based_ Single Page Application (SPA) designed to help users organize and track tasks efficiently. It provides an intuitive interface for managing tasks with key features, including:

- **Task Viewing**: Displays all tasks in an _"All Tasks"_ section and tasks due on a selected date in the _"Due Today"_ section.
- **Task CRUD Operations**: Supports creating, reading, updating, and deleting tasks via a RESTful API.
- **Task Status Handling**: Allows marking tasks with statuses (e.g., _Completed_, _Pending_) using a radio button, with completed tasks styled with a **strikethrough** effect.
- **Editing Tasks**: Enables task edits through a modal-like form overlay.
- **Due Date Parsing**: Formats due dates as _"Today"_, _"Tomorrow"_, or a full date for clarity.

The app leverages **React** for the frontend, **Node.js/Express** for the backend, and **PostgreSQL** for data persistence, delivering a robust task management solution.

---

## 2.1.3.2. Explanation of DB Design

The database is implemented in **PostgreSQL** with a single `tasks` table, designed for simplicity and optimized for task management operations.

### 2.1.3.2.1. ER Diagram

Below is a text-based Entity-Relationship (ER) diagram for the `tasks` table:

```
[Tasks]
+----+-------------+-------------+-------------+-------------+
| id | title       | posteddate  | duedate     | status      |
+----+-------------+-------------+-------------+-------------+
| PK | VARCHAR(1000)| DATE        | DATE        | VARCHAR(20) |
+----+-------------+-------------+-------------+-------------+
```

- **Entity**: `Tasks`
- **Attributes**:
  - `id`: _Primary key_, unique task identifier (string-based).
  - `title`: Task title, up to 1000 characters.
  - `posteddate`: Date the task was created.
  - `duedate`: Date the task is due.
  - `status`: Task status (e.g., _Completed_, _Pending_).

> **Note**: The schema focuses on core task data, with no additional tables, as user authentication is not implemented.

### 2.1.3.2.2. Data Dictionary

| Column Name  | Data Type     | Constraints          | Description                                           |
| ------------ | ------------- | -------------------- | ----------------------------------------------------- |
| `id`         | VARCHAR(4000) | PRIMARY KEY          | Unique task identifier (e.g., UUID or custom string). |
| `title`      | VARCHAR(1000) | NOT NULL             | Task title, max 1000 characters.                      |
| `posteddate` | DATE          | DEFAULT CURRENT_DATE | Date the task was created.                            |
| `duedate`    | DATE          |                      | Date the task is due (optional).                      |
| `status`     | VARCHAR(20)   | DEFAULT 'Pending'    | Task status (e.g., Completed, Pending).               |

### 2.1.3.2.3. Documentation of Indexes Used

To optimize query performance, the following indexes are defined:

- **Primary Key Index**:

  - Automatically created on `id` (VARCHAR(4000)).
  - _Purpose_: Ensures fast lookups and deletes by task ID.

- **Due Date Index**:

  ```sql
  CREATE INDEX idx_tasks_duedate ON tasks (duedate);
  ```

  - _Purpose_: Speeds up filtering tasks by due date, critical for the _Due Today_ feature and calendar-based queries.

- **Status Index**:
  ```sql
  CREATE INDEX idx_tasks_status ON tasks (status);
  ```
  - _Purpose_: Enhances performance for queries filtering tasks by status (e.g., showing only _Pending_ tasks).

These indexes improve read efficiency for common queries while balancing write performance.

### 2.1.3.2.4. Whether Code First or DB First Approach Has Been Used and Why?

The app uses a **Code-First** approach, to define the database schema in code.

- **Why Code-First?**

  - _Flexibility_: Enables rapid schema updates during development, aligned with application logic.
  - _Integration_: ORMs simplify database interactions in Node.js/Express.
  - _Version Control_: Schema definitions in code are tracked in Git, enhancing maintainability.
  - _Ease of Use_: Avoids manual SQL schema management for a simple table structure.

- **Why Not DB-First?**
  - DB-First requires separate SQL scripts, which adds complexity for a single-table schema.
  - Less agile for iterative development in a small project.

---

## 2.1.3.3. Structure of the Application

### 2.1.3.3.1. Whether Single Page Application (SPA) Had Been Used Along with API Binding

The app is a **Single Page Application (SPA)** built with **React**, utilizing **API binding** for data operations.

- **SPA Details**:

  - A single HTML page dynamically renders components based on user interactions.
  - React manages state with hooks (_useState_, _useEffect_) and updates the UI without page reloads.
  - Delivers a _smooth, responsive_ user experience.

- **API Binding**:
  - The frontend communicates with a RESTful API at `http://localhost:5000`.
  - **Endpoints**:
    - `GET /getAllTasks`: Fetches all tasks.
    - `POST /createTask`: Creates a new task.
    - `PUT /updateTask/:id`: Updates task details (e.g., title, duedate, status).
    - `DELETE /deleteTask/:id`: Deletes a task.
  - Requests are made via the `fetch` API with JSON payloads.
  - The backend (_Node.js/Express_) handles requests and interacts with PostgreSQL.

The SPA architecture decouples frontend and backend, enabling independent development and scalability.

### 2.1.3.3.2. Standard MVC Server-Side Page Rendering Has Been Used

_Not applicable_. The app uses an SPA approach, not server-side MVC rendering.

---

## 2.1.3.4. Frontend Structure

### 2.1.3.4.1. What Kind of Frontend Has Been Used and Why?

The frontend is built with **React** (functional components and hooks), styled with **CSS**, and enhanced with `react-calendar`.

- **Why React?**

  - _Modularity_: Reusable components (e.g., task list, modal, calendar) simplify development.
  - _Performance_: Virtual DOM optimizes rendering for dynamic task lists.
  - _Ecosystem_: Libraries like `react-calendar` streamline features like date filtering.
  - _Productivity_: Hooks (_useState_, _useEffect_) manage state and side effects efficiently.
  - _Community_: Extensive resources reduce development time.

- **Key Libraries**:
  - `react-calendar`: Enables date selection for task filtering.
  - (Optional) `react-router`: For navigation, if multi-page views are implemented.
- **Styling**: Custom CSS ensures a _clean, responsive_ design.

### 2.1.3.4.2. Candidates Can Either Use a Web Page Frontend or a Mobile Application

The app uses a **web page frontend**. A mobile app was not developed, as the web-based SPA is accessible across devices and simpler to deploy. The frontend is _responsive_, supporting desktops, tablets, and smartphones.

---

## 2.1.3.5. Build and Install

### 2.1.3.5.1. Environment Details Along with List of Dependencies

- **Environment**:

  - **Node.js**: v16.x or higher (frontend and backend).
  - **PostgreSQL**: v13 or higher (database).
  - **OS**: Windows, macOS, or Linux.
  - **Browsers**: Chrome, Firefox, Safari, Edge (latest versions).

- **Frontend Dependencies**:

  - `react`: ^19.1.0
  - `react-dom`: ^19.1.0
  - `react-calendar`: ^5.1.0
  - `react-scripts`: ^5.0.1 (Create React App)

- **Backend Dependencies**:
  - `express`: ^^5.1.0
  - `pg`: ^8.15.6 (PostgreSQL driver)
  - `cors`: ^2.8.5 (cross-origin support)
  - `dotenv`: ^16.5.0 (environment variables)
  - `nodemon`: ^3.1.10
  - `uuid`: ^11.1.0

### 2.1.3.5.2. Instructions on How to Compile or Build a Project

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install Frontend Dependencies**:

   ```bash
   cd Oristo Frontend
   cd my-app
   npm install
   ```

3. **Install Backend Dependencies**:

   ```bash
   cd ../Oristo Backend
   npm install
   ```

4. **Build the Frontend**:
   ```bash
   cd Oristo Frontend
   npm run build
   ```
   - Generates a production build in `Oristo Frontend/build`.

### 2.1.3.5.3. Instructions on How to Run or Install the Project

1. **Set Up PostgreSQL**:

   - Install PostgreSQL and create a database:
     ```bash
     createdb task_management
     ```
   - Configure connection details in `Oristo Backend/.env`:
     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=task_management
     DB_PORT=5432
     ```

2. **Run the Backend**:

   ```bash
   cd Oristo Backend
   nodemon index.js
   ```

   - Server runs at `http://localhost:5000`.

3. **Run the Frontend** (development):

   ```bash
   cd client
   npm start
   ```

   - App opens at `http://localhost:3000`.

- Access the app at `http://localhost:5000`.

---

## 2.1.3.6. General Documentation Not Covered Here

- **Assumptions**:

  - Built for _individual use_, with no user authentication.
  - API hosted locally at `http://localhost:5000` during development.
  - Single `tasks` table, designed for extensibility.

- **Future Enhancements**:

  - Add _task categories_ or _tags_ for better organization.
  - Implement _persistent filtering_ (e.g., save preferences in `localStorage`).
  - Enhance `react-calendar` with visual cues (e.g., dots on dates with tasks).
  - Improve error handling with _user-friendly notifications_.

- **Limitations**:
  - No user-specific tasks due to lack of authentication.
  - Single-table schema may require expansion for advanced features.
  - Mobile responsiveness may need further testing for edge cases.

---

For more details, review the repository’s source code or contact the developer.
