├── public/                # Static assets (favicon, etc.)
├── src/
│   ├── api/               # API clients (axios, projects, tasks)
│   ├── components/
│   │   ├── common/        # Reusable UI components (Header, Footer, Buttons, etc.)
│   │   ├── modals/        # Modal dialogs (Add Project, Add Task)
│   │   └── projects/      # Project-related components (Kanban board, Task table)
│   ├── composables/       # Custom composition functions (date formatting, toast notifications)
│   ├── icons/             # SVG and icon components
│   ├── layouts/           # Layout components (Default layout)
│   ├── router/            # Vue Router configuration
│   ├── stores/            # Pinia stores (project-store, tasks-store)
│   ├── styles/            # SCSS variables and global styles
│   ├── types/             # TypeScript type definitions (Project, Task)
│   └── views/             # Main pages (Project list, Project details)
├── index.html             # Main HTML entry point
├── package.json           # Project metadata and dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig*.json         # TypeScript configuration files
└── .gitignore             # Git ignore rules