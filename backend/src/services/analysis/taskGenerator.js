const logger = require('../../utils/logger');

/**
 * Task generator from code analysis results
 */
class TaskGenerator {
  /**
   * Generate tasks from analysis results
   * @param {Array} analysisResults - File analysis results
   * @param {Object} repository - Repository model instance
   * @param {Object} userSettings - User settings with priority weights
   * @returns {Array} Generated tasks
   */
  generateTasks(analysisResults, repository, userSettings = null) {
    const tasks = [];
    const priorityWeights = userSettings?.priority_weights || this.getDefaultWeights();

    // Extract tasks from comments
    for (const fileAnalysis of analysisResults) {
      if (!fileAnalysis.comments) continue;

      for (const comment of fileAnalysis.comments) {
        if (!comment.tasks || comment.tasks.length === 0) continue;

        for (const task of comment.tasks) {
          const generatedTask = this.createTaskFromComment(
            task,
            fileAnalysis,
            repository,
            priorityWeights
          );
          tasks.push(generatedTask);
        }
      }

      // Add tasks from incomplete code
      if (fileAnalysis.incompleteCode && fileAnalysis.incompleteCode.length > 0) {
        for (const incomplete of fileAnalysis.incompleteCode) {
          const generatedTask = this.createTaskFromIncompleteCode(
            incomplete,
            fileAnalysis,
            repository,
            priorityWeights
          );
          tasks.push(generatedTask);
        }
      }

      // Add tasks from security issues
      if (fileAnalysis.securityIssues && fileAnalysis.securityIssues.length > 0) {
        for (const securityIssue of fileAnalysis.securityIssues) {
          const generatedTask = this.createTaskFromSecurityIssue(
            securityIssue,
            fileAnalysis,
            repository,
            priorityWeights
          );
          tasks.push(generatedTask);
        }
      }
    }

    // Deduplicate tasks
    const uniqueTasks = this.deduplicateTasks(tasks);

    // Sort by priority
    uniqueTasks.sort((a, b) => b.priority_score - a.priority_score);

    logger.info(`Generated ${uniqueTasks.length} tasks for repository ${repository.full_name}`);
    return uniqueTasks;
  }

  /**
   * Create task from comment marker
   * @param {Object} task - Task from comment
   * @param {Object} fileAnalysis - File analysis results
   * @param {Object} repository - Repository instance
   * @param {Object} weights - Priority weights
   * @returns {Object} Task data
   */
  createTaskFromComment(task, fileAnalysis, repository, weights) {
    const priorityFactors = this.calculatePriorityFactors(
      task.category,
      fileAnalysis,
      repository,
      weights
    );

    const priorityScore = this.calculatePriorityScore(priorityFactors, weights);

    return {
      title: this.generateTitle(task),
      description: task.description,
      category: task.category,
      priority_score: priorityScore,
      priority_factors: priorityFactors,
      file_path: fileAnalysis.path,
      line_number: task.lineNumber,
      code_snippet: this.extractCodeSnippet(fileAnalysis, task.lineNumber),
      suggested_next_steps: this.generateSuggestedSteps(task.category, task.description),
      status: 'open',
      tags: [task.category.toLowerCase(), fileAnalysis.language]
    };
  }

  /**
   * Create task from incomplete code
   * @param {Object} incomplete - Incomplete code info
   * @param {Object} fileAnalysis - File analysis results
   * @param {Object} repository - Repository instance
   * @param {Object} weights - Priority weights
   * @returns {Object} Task data
   */
  createTaskFromIncompleteCode(incomplete, fileAnalysis, repository, weights) {
    const priorityFactors = this.calculatePriorityFactors(
      'INCOMPLETE_CODE',
      fileAnalysis,
      repository,
      weights,
      2 // Bonus for incomplete code
    );

    const priorityScore = this.calculatePriorityScore(priorityFactors, weights);

    return {
      title: `Incomplete Code: ${incomplete.type.replace(/_/g, ' ')}`,
      description: incomplete.description || 'Code implementation is incomplete',
      category: 'INCOMPLETE_CODE',
      priority_score: priorityScore,
      priority_factors: priorityFactors,
      file_path: fileAnalysis.path,
      line_number: incomplete.lineNumber || 0,
      code_snippet: this.extractCodeSnippet(fileAnalysis, incomplete.lineNumber),
      suggested_next_steps: 'Complete the implementation of this function or class',
      status: 'open',
      tags: ['incomplete', fileAnalysis.language, incomplete.type]
    };
  }

  /**
   * Create task from security issue
   * @param {Object} securityIssue - Security issue info
   * @param {Object} fileAnalysis - File analysis results
   * @param {Object} repository - Repository instance
   * @param {Object} weights - Priority weights
   * @returns {Object} Task data
   */
  createTaskFromSecurityIssue(securityIssue, fileAnalysis, repository, weights) {
    const priorityFactors = this.calculatePriorityFactors(
      'SECURITY',
      fileAnalysis,
      repository,
      weights,
      5 // High bonus for security issues
    );

    const priorityScore = this.calculatePriorityScore(priorityFactors, weights);

    return {
      title: `Security Issue: ${securityIssue.type.replace(/_/g, ' ')}`,
      description: securityIssue.description,
      category: 'SECURITY',
      priority_score: priorityScore,
      priority_factors: priorityFactors,
      file_path: fileAnalysis.path,
      line_number: securityIssue.lineNumber || 0,
      code_snippet: this.extractCodeSnippet(fileAnalysis, securityIssue.lineNumber),
      suggested_next_steps: 'Review and fix this security vulnerability immediately',
      status: 'open',
      tags: ['security', 'critical', fileAnalysis.language]
    };
  }

  /**
   * Calculate priority factors for a task
   * @param {string} category - Task category
   * @param {Object} fileAnalysis - File analysis results
   * @param {Object} repository - Repository instance
   * @param {Object} weights - Priority weights
   * @param {number} bonus - Additional priority bonus
   * @returns {Object} Priority factors
   */
  calculatePriorityFactors(category, fileAnalysis, repository, weights, bonus = 0) {
    const criticalCategories = ['SECURITY', 'BUG', 'FIXME'];
    const criticalComments = criticalCategories.includes(category) ? 1 : 0;

    // Calculate days since last commit
    const daysSinceCommit = repository.last_commit_at
      ? Math.floor((Date.now() - new Date(repository.last_commit_at)) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      critical_comments: criticalComments + (bonus > 3 ? 1 : 0),
      days_since_commit: Math.min(daysSinceCommit / 30, 10), // Normalize to 0-10
      open_issues: Math.min(repository.open_issues / 10, 10), // Normalize to 0-10
      code_complexity: Math.min(fileAnalysis.complexity / 20, 10), // Normalize to 0-10
      security_vulnerability: category === 'SECURITY' ? 1 : 0,
      custom_priority: bonus
    };
  }

  /**
   * Calculate priority score from factors
   * @param {Object} factors - Priority factors
   * @param {Object} weights - Priority weights
   * @returns {number} Priority score
   */
  calculatePriorityScore(factors, weights) {
    const score = 
      (factors.critical_comments * weights.critical_comments) +
      (factors.days_since_commit * weights.days_since_commit) +
      (factors.open_issues * weights.open_issues) +
      (factors.code_complexity * weights.code_complexity) +
      (factors.security_vulnerability * weights.security_vulnerability) +
      (factors.custom_priority * (weights.custom_priority || 1));

    return Math.round(score * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Generate task title
   * @param {Object} task - Task from comment
   * @returns {string} Task title
   */
  generateTitle(task) {
    const description = task.description.substring(0, 60);
    return `${task.category}: ${description}${task.description.length > 60 ? '...' : ''}`;
  }

  /**
   * Extract code snippet around line number
   * @param {Object} fileAnalysis - File analysis results
   * @param {number} lineNumber - Line number
   * @returns {string} Code snippet
   */
  extractCodeSnippet(fileAnalysis, lineNumber) {
    // This would ideally fetch the actual code
    // For now, return a placeholder
    return `Line ${lineNumber} in ${fileAnalysis.path}`;
  }

  /**
   * Generate suggested next steps
   * @param {string} category - Task category
   * @param {string} description - Task description
   * @returns {string} Suggested steps
   */
  generateSuggestedSteps(category, description) {
    const suggestions = {
      'TODO': 'Review the TODO comment and implement the required functionality',
      'FIXME': 'Investigate the issue described and apply the necessary fix',
      'BUG': 'Debug and resolve the reported bug',
      'SECURITY': 'Address the security vulnerability immediately',
      'OPTIMIZE': 'Profile the code and implement performance improvements',
      'REVIEW': 'Conduct a code review of the flagged section',
      'REFACTOR': 'Refactor the code to improve maintainability',
      'DOCUMENTATION': 'Add or update documentation for this code section'
    };

    return suggestions[category] || 'Review and address the flagged code';
  }

  /**
   * Deduplicate tasks
   * @param {Array} tasks - List of tasks
   * @returns {Array} Deduplicated tasks
   */
  deduplicateTasks(tasks) {
    const seen = new Map();

    for (const task of tasks) {
      const key = `${task.file_path}:${task.line_number}:${task.category}`;
      
      if (!seen.has(key)) {
        seen.set(key, task);
      } else {
        // If duplicate, keep the one with higher priority
        const existing = seen.get(key);
        if (task.priority_score > existing.priority_score) {
          seen.set(key, task);
        }
      }
    }

    return Array.from(seen.values());
  }

  /**
   * Get default priority weights
   * @returns {Object} Default weights
   */
  getDefaultWeights() {
    return {
      critical_comments: 3,
      days_since_commit: 2,
      open_issues: 2,
      code_complexity: 1.5,
      security_vulnerability: 5,
      custom_priority: 1
    };
  }
}

module.exports = TaskGenerator;
