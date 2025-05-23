import { TestCase } from '../entities/test-case.entity';
import { TestCaseId } from '../value-objects/test-case-id.vo';

export interface TestCaseRepository {
  findById(id: TestCaseId): Promise<TestCase | null>;
  findByTestSuiteId(testSuiteId: string): Promise<TestCase[]>;
  findAll(): Promise<TestCase[]>;
  save(testCase: TestCase): Promise<void>;
  delete(id: TestCaseId): Promise<void>;
}