# Online Voting System

A web-based voting platform built with Laravel, React, and Inertia.js to manage contestant registration, election positions, eligibility approvals, and online voting through a centralized administrative dashboard.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Workflow](#system-workflow)
- [Database Structure](#database-structure)
- [Requirements](#requirements)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Online Voting System is a web application designed to simplify the management of elections and contestant-based voting processes.

The platform provides a public-facing interface for viewing eligible contestants and a dedicated administrative interface for managing election data. Contestants can register for available positions, while administrators review registrations, manage payment statuses, and control which contestants are eligible to participate in the public voting process.

The application is designed with a modern web architecture, combining Laravel's backend capabilities with a responsive React interface through Inertia.js.

## Key Features

### 1. Contestant Registration

- Online contestant registration.
- Collection of contestant information, including name, email, telephone number, address, and passport details.
- Selection of an available election position.
- Passport photograph upload.
- Registration status management.

### 2. Position Management

- Create and manage election positions.
- Assign contestants to specific positions.
- Organize contestants by their respective positions.

### 3. Administrative Dashboard

- Centralized administration of election data.
- Contestant management and registration review.
- Approval, rejection, and status updates.
- Payment-status management.
- Overview of voter and contestant statistics.

### 4. Eligibility Management

The application uses contestant approval and payment status to determine which contestants appear on the public voting page.

The intended eligibility criteria are:

- Contestant registration status: `approved`
- Contestant payment status: `paid`

Only contestants meeting the configured eligibility criteria are displayed for voting.

### 5. Public Voting Interface

- Display eligible contestants.
- Group contestants by election position.
- Show contestant information and photographs.
- Allow voters to select contestants for the available positions.
- Provide a voting interface designed to simplify the selection process.

### 6. Voter Management

- Store and manage voter information.
- Record submitted votes.
- Support reporting on voter participation and election outcomes, subject to the implemented application logic.

### 7. Email Notifications

The application includes development for email notifications when contestant statuses are updated, helping communicate administrative decisions to registered contestants.

Email delivery depends on the configured mail service and successful notification processing.

## Technology Stack

| Technology     | Purpose                                                         |
| -------------- | --------------------------------------------------------------- |
| PHP            | Backend programming language                                    |
| Laravel        | Backend framework, routing, validation, and database operations |
| React          | Frontend user interface                                         |
| Inertia.js     | Integration between Laravel and React                           |
| Vite           | Frontend asset development and compilation                      |
| Tailwind CSS   | Interface styling                                               |
| MySQL          | Relational database                                             |
| Laravel Breeze | Authentication scaffolding, where configured                    |
| Git and GitHub | Version control and source-code management                      |
| Hostinger      | Application hosting                                             |

## System Workflow

1. **Position creation:** An administrator creates the available election positions.
2. **Contestant registration:** Contestants submit their information and select a position.
3. **Administrative review:** The administrator reviews each registration and approves or rejects it.
4. **Payment management:** The administrator updates the contestant's payment status.
5. **Eligibility filtering:** Contestants who satisfy the application's approval and payment requirements become visible on the public voting page.
6. **Voting:** Voters select contestants through the public interface.
7. **Administration and reporting:** Administrators manage records and review available voting statistics and results.

## Database Structure

The application uses a relational database to organize election information.

The principal entities include:

- **Admins:** Administrative accounts and access.
- **Contestants:** Contestant details, registration information, photographs, positions, and statuses.
- **Positions:** Election positions available for contestant registration.
- **Voters:** Voter information.
- **Votes:** Records associated with submitted voting selections.

The exact database relationships and constraints are defined by the application's Laravel models and migration files.

## Requirements

Before installing the application, ensure that your development environment has:

- PHP version compatible with the project's Laravel version.
- Composer.
- Node.js and npm.
- MySQL or another database supported by the configured Laravel application.
- Git.

Check `composer.json` and `package.json` for the exact dependency versions used by your project.

## Installation and Setup

### 1. Clone the repository

Replace the example repository URL with the actual GitHub repository URL.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install backend dependencies

```bash
composer install
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a local environment file:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**Linux or macOS**

```bash
cp .env.example .env
```

Configure the application environment and database credentials in `.env`.

### 5. Generate the application key

```bash
php artisan key:generate
```

### 6. Configure the database

Create a database and update the relevant environment variables:

```dotenv
APP_NAME="Online Voting System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Use your actual database credentials. Never commit production credentials to GitHub.

### 7. Run database migrations

```bash
php artisan migrate
```

If the application requires an administrator account, create it using the project's configured administrator creation process.

**Important:** Do not run `php artisan migrate:fresh` against a production database because it drops existing tables and their data.

### 8. Create the public storage link

```bash
php artisan storage:link
```

This command is useful when contestant photographs are stored on Laravel's public disk. If your hosting provider restricts symbolic links, configure an appropriate alternative.

### 9. Compile frontend assets

For local development:

```bash
npm run dev
```

For production assets:

```bash
npm run build
```

### 10. Start the development server

```bash
php artisan serve
```

Open the local application at:

[http://127.0.0.1:8000](http://127.0.0.1:8000)

Keep the Vite development server running in a separate terminal when using `npm run dev`.

## Environment Configuration

The following environment variables are commonly required:

| Variable        | Description                                  |
| --------------- | -------------------------------------------- |
| `APP_NAME`      | Application name                             |
| `APP_ENV`       | Environment, such as `local` or `production` |
| `APP_DEBUG`     | Enables or disables debug output             |
| `APP_URL`       | Base URL of the application                  |
| `DB_CONNECTION` | Database driver                              |
| `DB_HOST`       | Database server                              |
| `DB_PORT`       | Database port                                |
| `DB_DATABASE`   | Database name                                |
| `DB_USERNAME`   | Database username                            |
| `DB_PASSWORD`   | Database password                            |
| `MAIL_MAILER`   | Configured email transport                   |
| `MAIL_HOST`     | Email server hostname                        |
| `MAIL_PORT`     | Email server port                            |
| `MAIL_USERNAME` | Email service username                       |
| `MAIL_PASSWORD` | Email service password                       |

Only configure variables that are relevant to your installed Laravel version and application.

## Running the Application

The application is hosted on Hostinger. Production deployment requires the correct document root, environment configuration, database connectivity, file permissions, and compiled frontend assets.

Administrative access should only be provided to authorized users.

## Deployment

When deploying a new version:

1. Back up the production database and important uploaded files.
2. Update the application source code.
3. Install production PHP dependencies using Composer where available.
4. Configure production environment variables securely.
5. Build or upload the production frontend assets.
6. Run pending database migrations using the appropriate production procedure.
7. Verify file permissions, photograph access, authentication, and email delivery.
8. Test contestant registration, administrative status updates, and the voting workflow.

For production, set:

```dotenv
APP_ENV=production
APP_DEBUG=false
```

Do not expose the `.env` file, application secrets, or database credentials through the web server.

## Security Considerations

Security is especially important for voting applications.

- Protect administrative routes with authentication and authorization middleware.
- Validate all submitted data on the server.
- Restrict contestant eligibility to the configured approval and payment requirements.
- Prevent duplicate or unauthorized votes using appropriate server-side checks and database constraints.
- Protect uploaded photographs by validating file types, sizes, and storage locations.
- Use HTTPS in production.
- Keep Laravel, PHP, and third-party dependencies updated.
- Disable debug output in production.
- Never publish administrator passwords, voter records, or sensitive application credentials.

These are recommended safeguards; their effectiveness depends on the actual implementation and testing of the application.

## Future Improvements

Potential enhancements include:

- Election start and end scheduling.
- More comprehensive voting reports and result visualizations.
- Improved voter verification and duplicate-vote prevention.
- Audit logs for administrative actions.
- Exportable election reports.
- Enhanced email notifications and delivery monitoring.
- Automated testing for registration, eligibility, and voting rules.
- Accessibility and mobile usability improvements.

## Contributing

Contributions and suggestions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Commit your changes with a descriptive message.
5. Open a pull request explaining the changes.

For bugs or feature requests, open an issue in the GitHub repository.

## License

No license has been specified in this README.

Before distributing or allowing reuse of the source code, add a `LICENSE` file and select a license that reflects your intentions as the project owner.

## Author

Developed as a web-based solution for managing contestant registration and election voting processes.

**Source Code:** Add the GitHub repository URL here.
