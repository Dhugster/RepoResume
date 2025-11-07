/**
 * Repository health calculator
 */
class HealthCalculator {
  /**
   * Calculate repository health metrics
   * @param {Object} data - Analysis data
   * @returns {Object} Health metrics
   */
  calculateHealth(data) {
    const {
      analysisResults,
      tasks,
      commits,
      issues,
      pullRequests,
      repository
    } = data;

    const metrics = {
      code_coverage: this.estimateCodeCoverage(analysisResults),
      technical_debt_ratio: this.calculateTechnicalDebt(tasks, analysisResults),
      dependency_freshness: this.estimateDependencyFreshness(commits),
      documentation_completeness: this.calculateDocumentation(analysisResults),
      test_reliability: this.estimateTestReliability(analysisResults)
    };

    // Calculate overall health score (0-100)
    const healthScore = this.calculateOverallHealth(metrics);

    return {
      ...metrics,
      overall_health: healthScore,
      grade: this.getHealthGrade(healthScore)
    };
  }

  /**
   * Estimate code coverage
   * @param {Array} analysisResults - Analysis results
   * @returns {number} Coverage percentage (0-100)
   */
  estimateCodeCoverage(analysisResults) {
    if (!analysisResults || analysisResults.length === 0) return 0;

    const filesWithTests = analysisResults.filter(f => f.hasTests).length;
    const totalFiles = analysisResults.length;

    // Simple heuristic: if tests exist, assume 60-80% coverage
    const baseScore = (filesWithTests / totalFiles) * 70;
    
    return Math.min(Math.round(baseScore), 100);
  }

  /**
   * Calculate technical debt ratio
   * @param {Array} tasks - Generated tasks
   * @param {Array} analysisResults - Analysis results
   * @returns {number} Technical debt ratio (0-100, lower is better)
   */
  calculateTechnicalDebt(tasks, analysisResults) {
    if (!analysisResults || analysisResults.length === 0) return 0;

    // Count TODOs, FIXMEs, and other markers
    const technicalDebtMarkers = tasks.filter(t => 
      ['TODO', 'FIXME', 'HACK', 'XXX', 'INCOMPLETE_CODE'].includes(t.category)
    ).length;

    // Calculate total lines of code
    const totalLines = analysisResults.reduce((sum, f) => sum + (f.lineCount || 0), 0);

    if (totalLines === 0) return 0;

    // Ratio of debt markers to lines of code (per 1000 lines)
    const ratio = (technicalDebtMarkers / totalLines) * 1000;

    // Convert to 0-100 scale (higher ratio = worse score)
    return Math.min(Math.round(ratio * 10), 100);
  }

  /**
   * Estimate dependency freshness
   * @param {Array} commits - Recent commits
   * @returns {number} Freshness score (0-100)
   */
  estimateDependencyFreshness(commits) {
    if (!commits || commits.length === 0) return 50; // Default score

    const latestCommit = commits[0];
    const commitDate = new Date(latestCommit.commit.author.date);
    const daysSinceCommit = Math.floor((Date.now() - commitDate) / (1000 * 60 * 60 * 24));

    // Score decreases with time since last commit
    if (daysSinceCommit < 7) return 100;
    if (daysSinceCommit < 30) return 80;
    if (daysSinceCommit < 90) return 60;
    if (daysSinceCommit < 180) return 40;
    if (daysSinceCommit < 365) return 20;
    return 10;
  }

  /**
   * Calculate documentation completeness
   * @param {Array} analysisResults - Analysis results
   * @returns {number} Documentation score (0-100)
   */
  calculateDocumentation(analysisResults) {
    if (!analysisResults || analysisResults.length === 0) return 0;

    const filesWithDocs = analysisResults.filter(f => f.hasDocumentation).length;
    const totalFiles = analysisResults.length;

    const score = (filesWithDocs / totalFiles) * 100;
    return Math.round(score);
  }

  /**
   * Estimate test reliability
   * @param {Array} analysisResults - Analysis results
   * @returns {number} Test reliability score (0-100)
   */
  estimateTestReliability(analysisResults) {
    if (!analysisResults || analysisResults.length === 0) return 0;

    const testFiles = analysisResults.filter(f => f.hasTests);
    if (testFiles.length === 0) return 0;

    // Heuristic: presence of tests = 70 base score
    // More test files relative to source files = higher score
    const totalFiles = analysisResults.length;
    const testRatio = testFiles.length / totalFiles;

    const score = 70 + (testRatio * 30);
    return Math.min(Math.round(score), 100);
  }

  /**
   * Calculate overall health score
   * @param {Object} metrics - Individual metrics
   * @returns {number} Overall health score (0-100)
   */
  calculateOverallHealth(metrics) {
    // Weighted average of all metrics
    const weights = {
      code_coverage: 0.25,
      technical_debt_ratio: 0.25, // Inverted (100 - value)
      dependency_freshness: 0.20,
      documentation_completeness: 0.15,
      test_reliability: 0.15
    };

    const score = 
      (metrics.code_coverage * weights.code_coverage) +
      ((100 - metrics.technical_debt_ratio) * weights.technical_debt_ratio) +
      (metrics.dependency_freshness * weights.dependency_freshness) +
      (metrics.documentation_completeness * weights.documentation_completeness) +
      (metrics.test_reliability * weights.test_reliability);

    return Math.round(score);
  }

  /**
   * Get health grade from score
   * @param {number} score - Health score
   * @returns {string} Grade (A, B, C, D, F)
   */
  getHealthGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}

module.exports = HealthCalculator;
