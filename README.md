
![Logo](https://api-task.agameeit.com/images/logo_xs.png)


# Task Manager App (Frontend)

**Built with React.js (Vite) + TypeScript**

This repository contains the frontend of the Task Manager App, built using React.js with Vite for fast development and optimized performance. The application provides an intuitive UI for managing tasks efficiently.


## 🚀 Features

- User authentication (login/signup).
- Create, edit and delete tasks.
- Drag & Drop task to change status or its position.
- Task filtering and sorting.
- Responsive design for mobile and desktop.
- State management using React Query or Redux.
- Form validation with Zod.
- API integration with Laravel backend.
- PWA Support


## ⚙️ Tech Stack

**Frontend:** React.js (Vite), TypeScript

**Styling:** shadcn/ui component, Tailwind CSS

**State Management:** React Query, Zustand

**API Client:** HTTP fetch

**Form Validation:** Zod


## 📦 Installation & Setup

Clone the project

```bash
  git clone https://github.com/abir-25/task-manager-app-client.git
```

Go to the project directory

```bash
  cd task-manager-client
```

Install dependencies

```bash
  pnpm install
```

Configure environment variable:
- Create a .env file in the root directory.
- Add the following variable
```bash
  VITE_REACT_APP_API_URL=https://api-task.agameeit.com/api/v1

```

Start the development server

```bash
  pnpm run dev
```


## 🔌 Build for Production

To build this project run

```bash
  pnpm run build
```

## 🛠️ Deployment

- The build files are located in the **dist** folder.
- You can deploy it to services like **Vercel**, **Netlify**, or a **custom server**.

## 🔗 Live Site URL
[![Task Manager App](https://api-task.agameeit.com/images/logo_xs.png)](https://task.agameeit.com/)



## Screenshots
**App Dashboard**
![App Screenshot](https://api-task.agameeit.com/images/task_dashboard.png)

**Create Task**
![App Screenshot](https://api-task.agameeit.com/images/task_create.png)

**Task List**
![App Screenshot](https://api-task.agameeit.com/images/task_list.png)

**Drag & Drop Task**
![App Screenshot](https://api-task.agameeit.com/images/task_drag.png)

**Task Optimistic Update**
![App Screenshot](https://api-task.agameeit.com/images/task_optimistic_update.png)

**Task Sorting**
![App Screenshot](https://api-task.agameeit.com/images/task_sorting.png)

**Task Search (Debounce) By title**
![App Screenshot](https://api-task.agameeit.com/images/task_search.png)

**Task Delete**
![App Screenshot](https://api-task.agameeit.com/images/task_delete.png)

