# Group Transactions & Expense Sharing Platform

This project is a web-based application that allows users to create groups for events or shared activities and track expenses between participants.  
The system provides a clear overview of who paid for what, how costs are split, and who owes whom money within each group.

The primary goal is to make group expenses transparent, simple, and fair.

---

## Core Features (MVP)

- User registration and authentication
- User profiles and settings
- Group creation and management
- Transactions within groups
- Automatic calculation of balances (who owes who)
- User dashboard with group / financial overview

---

## Project Structure

The project is structured around features, with clear separation between:

- HTML structure
- CSS styling
- JavaScript / application logic
- Database-related tasks
- Documentation

Each feature or concern is tracked as a dedicated issue and mapped directly to a development branch.

---

## Coding Standards

### File and Folder Naming

Primary rule:
- Use kebab-case for files and folders
- Use PascalCase for React components

Folders:
```
user-profile/
dashboard-settings/
create-group/
new-transaction/
```

General Files:
```
user-profile.tsx
auth-provider.tsx
transaction-utils.ts
```

Next.js Special Files (mandated by framework):
```
page.tsx
layout.tsx
loading.tsx
error.tsx
route.ts
middleware.ts
global.css
```

Dynamic Routes:
```
[userId].tsx
[slug].tsx
```

Lowercase, descriptive parameter names are always used.

---

## Code Naming Standards

React Components:
- PascalCase
```
UserProfile
CreateGroupModal
TransactionList
```

Variables and Props:
- camelCase
```
userName
totalAmount
groupMembers
```

Functions:
- camelCase
```
sendWelcomeEmail()
calculateBalance()
formatDate()
```

Custom Hooks:
- camelCase with use prefix
```
useAuth()
useUser()
useTransactions()
```

Constants:
- UPPER_SNAKE_CASE
```
API_BASE_URL
DEFAULT_CURRENCY
MAX_GROUP_SIZE
```

Environment Variables:
- UPPER_SNAKE_CASE
```
DATABASE_URL
JWT_SECRET
NODE_ENV
```

---

## Issue & Feature Naming Convention

Issues are used to describe one clear feature or concern and follow this structure:

```
<AREA> / <Feature Name>
```

Examples:
```
HTML / Front Page
CSS / User Dashboard
JS / Create Group
DB / Core Tables
Documentation / README.md
```

- The area defines the responsibility (HTML, CSS, JS, DB, Documentation, Feature)
- The feature name is written in Title Case
- Each issue represents a focused, trackable unit of work
- MVP-related issues are labeled accordingly

---

## Branch Naming Convention

Branches are directly derived from issue names.

Rules:
- Same structure as the issue name
- No spaces
- No dashes
- Uses slashes to preserve hierarchy

Example:

Issue:
```
HTML / Front Page
```

Branch:
```
HTML/Front-Page
```

Another example:

Issue:
```
JS / New Transaction
```

Branch:
```
JS/New-Transaction
```

This ensures:
- Clear traceability between issues and branches
- Predictable branch names
- Clean collaboration and review process

---

## Workflow Summary

1. Create an issue following the naming convention
2. Create a branch derived from the issue name
3. Implement the feature following coding standards
4. Keep commits focused and descriptive
5. Merge once the issue requirements are fulfilled

---

## Documentation

Documentation is treated as a first-class feature and is tracked via dedicated issues such as:
```
Documentation / README.md
Documentation / Word Document
```

---

## Status

This project is currently in MVP development, with all core functionality scoped and tracked through issues.
