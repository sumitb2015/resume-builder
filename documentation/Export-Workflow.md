# PDF Export Engine & Puppeteer Workflow

High-fidelity PDF generation is handled by a headless **Puppeteer** instance on the [[Backend-Services|Backend]].

## PDF Generation Steps
1. **Request**: Frontend sends resume JSON, template configuration, and page count.
2. **HTML Generation**: Backend generates the final HTML/CSS using [[Frontend-Components#TemplateRenderer|TemplateRenderer]].
3. **Browser Execution**: Puppeteer launches a headless browser, injects the HTML, and navigates to the page.
4. **PDF Render**: Puppeteer uses `page.pdf()` with specific print parameters to generate the file.
5. **Response**: The PDF is returned as a blob to the [[Frontend-Components|Frontend]] for download.

## Puppeteer Lifecycle & Performance
- **Connection Management**: Reuses a single browser instance across requests to reduce cold start times.
- **Auto-Cleanup**: Automatically closes browser pages and restarts the browser instance after a fixed number of requests to prevent memory leaks.
- **Global Cleanup**: Hooks into `SIGINT` and `SIGTERM` signals for graceful shutdown on server restart.

## Optimization
- **Headless Mode**: Puppeteer runs without a GUI to minimize resource usage.
- **Resource Constraints**: Specifically configured for low-resource container environments (like Railway).
