import { TestCase } from '../entities/test-case.entity';
import { TestStatus } from '../value-objects/test-status.enum';

export class TestCaseValidationService {
  public validateTestCaseForExecution(testCase: TestCase): boolean {
    // A test case can be executed only if it's in ACTIVE status
    if (testCase.status !== TestStatus.ACTIVE) {
      return false;
    }

    // A test case must have at least one step to be executable
    if (testCase.steps.length === 0) {
      return false;
    }

    return true;
  }

  public validateTestCaseStepsSequence(testCase: TestCase): boolean {
    const steps = testCase.steps;

    // Check if steps are in correct sequence
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].order !== i + 1) {
        return false;
      }
    }

    return true;
  }
}