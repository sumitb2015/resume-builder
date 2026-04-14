# Frontend Components & State Management

The frontend is a React Single Page Application (SPA) that provides a rich, interactive resume editing experience.

## Key Components
- [[Frontend-Components#Resume-Builder|ResumeBuilder]]: The main form-based editor where users enter personal details, experience, education, etc.
- [[Frontend-Components#Style-Panel|StylePanel]]: A sidebar that controls [[Architecture-Overview#Technology-Stack|Template selection]], colors, fonts, and zoom levels.
- [[Frontend-Components#Export-Preview|ExportPreview]]: A real-time preview of the resume using the selected template.
- [[AI-Workflow#Career-Wizard|AiWriterFlow]]: A step-by-step wizard for generating a resume from scratch using AI.

## State Management
The application uses **React Context** to manage global state:
- [[Frontend-Components#ResumeContext|ResumeContext]]: Manages the resume data, active template, and undo/redo history.
- **AuthContext**: Handles Firebase user authentication and profile state.
- **PlanContext**: Manages user subscription tiers (Free, Pro, Ultimate).

## User Productivity Features
- **Undo/Redo**: Implemented via a history stack in `ResumeContext`, accessible via `Ctrl+Z` and `Ctrl+Y`.
- **Searchable Font Selection**: Using the [[Frontend-Components#FontSelect|FontSelect]] component.
- **Form Validation**: Real-time feedback for required fields.
