# RepoResume User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Repositories](#managing-repositories)
4. [Working with Tasks](#working-with-tasks)
5. [Understanding Health Metrics](#understanding-health-metrics)
6. [Settings & Customization](#settings--customization)
7. [Exporting Data](#exporting-data)
8. [Best Practices](#best-practices)
9. [FAQ](#faq)

## Getting Started

### First Time Login

1. Navigate to the application URL
2. Click **"Login with GitHub"**
3. Authorize RepoResume to access your repositories
4. You'll be redirected to the Dashboard

### Initial Setup

After logging in for the first time:

1. Click **"Sync Repositories"** to fetch your GitHub repos
2. Select repositories you want to monitor
3. Click **"Analyze"** on a repository to start code analysis
4. Wait for analysis to complete (progress shown in UI)
5. View generated tasks and health metrics

## Dashboard Overview

The Dashboard is your central hub showing:

### Repository Cards

Each card displays:
- **Repository name** and description
- **Health Score** (0-100) with color-coded grade:
  - 🟢 **A (90-100)**: Excellent health
  - 🟡 **B (80-89)**: Good health
  - 🟠 **C (70-79)**: Fair health
  - 🔴 **D (60-69)**: Poor health
  - ⚫ **F (<60)**: Critical issues

- **Quick Stats**:
  - Open tasks count
  - Last analysis date
  - Primary language

### Quick Actions

- **Sync All**: Refresh repository list from GitHub
- **View Tasks**: See all tasks across repositories
- **Settings**: Customize your preferences

## Managing Repositories

### Adding Repositories

1. Click **"Sync Repositories"**
2. All your GitHub repos (public and private) will be imported
3. Archived repos are automatically excluded

### Analyzing a Repository

1. Click on a repository card
2. Click **"Analyze Repository"**
3. Analysis process:
   - Fetches repository tree
   - Analyzes source code files
   - Detects TODOs, FIXMEs, and code patterns
   - Calculates health metrics
   - Generates prioritized tasks
4. Progress is shown in real-time
5. Results appear when complete

### Repository Settings

Click **⚙️ Settings** on a repository to configure:

- **Sync Interval**: How often to check for updates (15min - 24hrs)
- **Active Status**: Enable/disable monitoring
- **Branch**: Which branch to analyze (default: main)

### Removing Repositories

1. Navigate to repository detail page
2. Click **"Remove Repository"**
3. Confirm deletion
4. Repository and all associated tasks will be deleted

## Working with Tasks

### Task List

Tasks are displayed with:

- **Title**: Brief description from comment/issue
- **Priority Score**: Calculated importance (0-100+)
- **Category**: Type of task
  - 🔴 **SECURITY**: Security vulnerabilities
  - 🟠 **BUG**: Reported bugs
  - 🟡 **FIXME**: Code that needs fixing
  - 🟢 **TODO**: Planned features
  - 🔵 **INCOMPLETE_CODE**: Unfinished implementations
  - ⚪ **OPTIMIZE**: Performance improvements
  - 🟣 **REVIEW**: Code review needed

- **Status**: Current state
  - **Open**: Not started
  - **In Progress**: Currently working on
  - **Completed**: Finished
  - **Snoozed**: Postponed until date
  - **Cancelled**: No longer needed

### Viewing Task Details

Click on a task to see:

- **Description**: Full task description
- **Location**: File path and line number
- **Code Snippet**: Relevant code section
- **Priority Breakdown**: How score was calculated
- **Related Issues/PRs**: Linked GitHub issues
- **Suggested Next Steps**: AI-generated guidance
- **Last Commit Info**: When code was last modified

### Task Actions

**Mark Complete**:
1. Click ✓ checkmark icon
2. Task moves to "Completed" status
3. Completion date is recorded

**Snooze Task**:
1. Click 💤 snooze icon
2. Select date to resume
3. Task hidden until that date

**Add Notes**:
1. Click task to open details
2. Add your notes in the notes field
3. Notes are saved automatically

**Change Priority**:
1. Open task details
2. Adjust custom priority (0-10)
3. Priority score recalculated automatically

**Delete Task**:
1. Click 🗑️ delete icon
2. Confirm deletion
3. Task permanently removed

### Filtering Tasks

Use filters to find specific tasks:

- **By Status**: Open, In Progress, Completed, etc.
- **By Category**: TODO, FIXME, BUG, etc.
- **By Repository**: Show tasks from specific repo
- **By Priority**: High, Medium, Low
- **Search**: Find by title or description

### Sorting Tasks

Sort tasks by:
- **Priority** (default): Highest priority first
- **Date**: Newest or oldest first
- **Repository**: Group by repository
- **Status**: Group by status

## Understanding Health Metrics

### Overall Health Score

Calculated from five key metrics:

#### 1. Code Coverage (25% weight)
- Estimated test coverage percentage
- Based on presence of test files
- **Target**: 80%+ coverage

#### 2. Technical Debt Ratio (25% weight)
- Density of TODOs, FIXMEs, and code smells
- Measured per 1000 lines of code
- **Target**: <10 markers per 1000 lines

#### 3. Dependency Freshness (20% weight)
- How recently dependencies were updated
- Based on last commit date
- **Target**: Updated within 30 days

#### 4. Documentation Completeness (15% weight)
- Presence of comments and documentation
- README, JSDoc, docstrings, etc.
- **Target**: 70%+ files documented

#### 5. Test Reliability (15% weight)
- Test suite presence and quality
- Test-to-source file ratio
- **Target**: Comprehensive test suite

### Health Trends

View health over time:
- Track improvements or degradation
- Identify problem areas
- Measure impact of your work

### Repository Comparison

Compare health scores across repositories to:
- Prioritize which repos need attention
- Identify best-practice examples
- Benchmark against your standards

## Settings & Customization

### User Settings

Access via **⚙️ Settings** in navigation:

#### Theme
- **Light**: Bright theme for daytime
- **Dark**: Easy on eyes in low light
- **Auto**: Follows system preference

#### Default View
- **List View**: Traditional task list
- **Kanban Board**: Visual board with columns

#### Priority Weights

Customize how priority is calculated:

```
Priority Score = 
  (Critical Comments × Weight) +
  (Days Since Commit × Weight) +
  (Open Issues × Weight) +
  (Code Complexity × Weight) +
  (Security Vulnerabilities × Weight) +
  (Custom Priority × Weight)
```

**Default Weights**:
- Critical Comments: 3
- Days Since Commit: 2
- Open Issues: 2
- Code Complexity: 1.5
- Security Vulnerabilities: 5
- Custom Priority: 1

**Adjusting Weights**:
1. Go to Settings → Priority Weights
2. Adjust sliders for each factor
3. Save changes
4. All tasks recalculated automatically

#### Custom Keywords

Add your own task markers:

**Example**:
- Add "URGENT" to BUG category
- Add "DEPRECATED" to REVIEW category
- Add team-specific markers

**How to Add**:
1. Settings → Custom Keywords
2. Select category
3. Add new keyword
4. Save changes

#### Notifications

Configure notifications for:
- **Critical Tasks**: High-priority security issues
- **Daily Summary**: Daily task digest
- **Analysis Complete**: When repo analysis finishes
- **Upcoming Deadlines**: Snoozed tasks resuming

**Channels**:
- Email (if configured)
- Slack (webhook required)
- Discord (webhook required)

#### Export Preferences

Set defaults for:
- **Format**: JSON, CSV, or Markdown
- **Include Metadata**: Extra task details
- **Include Code Snippets**: Code in exports

#### Integrations

Connect with external tools:

**Trello**:
1. Get API key from Trello
2. Authorize RepoResume
3. Select target board
4. Tasks sync automatically

**Jira**:
1. Generate API token
2. Enter project key
3. Map task categories to issue types
4. Enable sync

**Asana**:
1. Get access token
2. Select workspace
3. Choose target project
4. Configure sync settings

## Exporting Data

### Export Tasks

**From Task List**:
1. Click **"Export"** button
2. Select format:
   - **JSON**: Structured data with all fields
   - **CSV**: Spreadsheet-compatible
   - **Markdown**: Human-readable format
3. Choose scope:
   - All tasks
   - Filtered tasks only
   - Specific repository
4. Download file

**JSON Export Structure**:
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "TODO: Implement feature X",
      "description": "Details about the task",
      "category": "TODO",
      "priority_score": 15.5,
      "status": "open",
      "file_path": "src/components/Feature.jsx",
      "line_number": 42,
      "repository": {
        "name": "my-repo",
        "full_name": "username/my-repo"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**CSV Export Columns**:
- Title
- Description
- Category
- Priority Score
- Status
- Repository
- File Path
- Line Number
- Created At

**Markdown Export Format**:
```markdown
# RepoResume Tasks Export

## 🔴 Critical Priority (5)
- **[SECURITY]** Fix SQL injection vulnerability
  - Priority: 25.0
  - Repository: username/backend-api
  - Location: src/database/queries.js:123

## 🟡 High Priority (12)
...
```

### Export Repository Report

**Full Report**:
1. Open repository detail page
2. Click **"Export Report"**
3. Select format (JSON or Markdown)
4. Report includes:
   - Repository information
   - Health metrics
   - All tasks with details
   - Analysis statistics

## Best Practices

### Getting the Most from RepoResume

#### 1. Regular Analysis

- Analyze repositories weekly
- Set auto-sync to 24 hours
- Review new tasks regularly

#### 2. Prioritize Effectively

- Always handle SECURITY tasks first
- Group related tasks together
- Use custom priorities for deadlines

#### 3. Keep Tasks Updated

- Mark tasks complete when done
- Add notes for context
- Snooze low-priority items

#### 4. Use Filters

- Create filtered views for workflows
- Focus on one category at a time
- Use repository filters for context-switching

#### 5. Monitor Health

- Track health trends over time
- Set goals for improvement
- Address declining metrics quickly

#### 6. Integrate with Workflow

- Export to your task manager
- Set up notifications
- Use keyboard shortcuts

### Team Usage

#### For Team Leads:

- Monitor all team repositories
- Compare health across projects
- Identify projects needing support
- Track technical debt reduction

#### For Developers:

- Focus on your assigned repos
- Use custom priorities for sprints
- Export tasks to your workflow
- Track completion over time

#### For Project Managers:

- View overall project health
- Export reports for stakeholders
- Monitor progress on issues
- Plan remediation efforts

## FAQ

### General Questions

**Q: Is my code stored on your servers?**
A: No. RepoResume analyzes code through GitHub's API and only stores task metadata. Your code remains on GitHub.

**Q: How often should I analyze repositories?**
A: Weekly is recommended for active projects. Set auto-sync for automated updates.

**Q: Can I analyze private repositories?**
A: Yes, with GitHub OAuth permissions granted.

**Q: What languages are supported?**
A: JavaScript, TypeScript, Python, Java, C, C++, Go, Ruby, PHP, Rust, and more.

### Tasks & Analysis

**Q: How are priority scores calculated?**
A: See "Priority Weights" in Settings section. You can customize the formula.

**Q: Can I manually add tasks?**
A: Currently, tasks are generated from code analysis. Manual task creation is coming soon.

**Q: Why don't I see tasks for my repository?**
A: Ensure:
- Repository has been analyzed (not just synced)
- Code contains TODO/FIXME comments
- File types are supported
- Files aren't in excluded directories (node_modules, dist, etc.)

**Q: How do I get better task detection?**
A: Add clear comment markers:
```javascript
// TODO: Implement feature X
// FIXME: Bug in authentication
// SECURITY: Validate user input
```

### Health Metrics

**Q: My health score seems low. What should I do?**
A: Focus on:
1. Adding tests (improves coverage)
2. Resolving TODOs/FIXMEs (reduces debt)
3. Updating dependencies (improves freshness)
4. Adding documentation (improves completeness)

**Q: Can I exclude files from analysis?**
A: Files in these directories are automatically excluded:
- node_modules/
- dist/, build/, out/
- coverage/
- .git/
- vendor/

### Export & Integration

**Q: Can I schedule automatic exports?**
A: Not yet, but you can use the API to automate exports.

**Q: How do I set up Slack notifications?**
A: Settings → Integrations → Slack → Add webhook URL

**Q: Can I integrate with GitHub Issues?**
A: Tasks show related GitHub issues. Direct issue creation coming soon.

### Troubleshooting

**Q: Analysis is stuck/failing**
A: Try:
1. Check repository is accessible on GitHub
2. Re-sync repository
3. Check GitHub API rate limits
4. Contact support if persists

**Q: Tasks aren't updating**
A: Tasks are created during analysis. Re-analyze repository to update.

**Q: Can't login with GitHub**
A: Ensure:
- OAuth app is configured correctly
- Callback URL matches settings
- Cookies are enabled in browser

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `?` | Show shortcuts help |
| `/` | Focus search |
| `n` | New task filter |
| `r` | Refresh current view |
| `s` | Open settings |
| `Esc` | Close modal/dialog |
| `1-5` | Filter by priority |
| `a` | Select all tasks |

## Getting Help

Need assistance?

- 📧 **Email**: support@reporesume.dev
- 🐛 **Bug Reports**: GitHub Issues
- 💡 **Feature Requests**: GitHub Discussions
- 📚 **Documentation**: This guide + README.md
- 🎥 **Video Tutorials**: [YouTube Channel]

## Feedback & Improvements

We'd love to hear from you!

- **What features would you like?**
- **How can we improve the UI?**
- **What integrations do you need?**

Submit feedback via:
- GitHub Issues
- Email to feedback@reporesume.dev
- In-app feedback form (Settings → Feedback)

---

**Happy coding!** 🚀 Let RepoResume help you stay on top of your projects.
