import { AggregateRoot } from '../../common/aggregate-root';
import { TestCaseId } from '../value-objects/test-case-id.vo';
import { TestStatus } from '../value-objects/test-status.enum';
import { TestPriority } from '../value-objects/test-priority.enum';
import { TestStep } from '../value-objects/test-step.vo';
import { TestCaseCreatedEvent } from '../events/test-case-created.event';
import { TestCaseUpdatedEvent } from '../events/test-case-updated.event';
import { TestCaseStatusChangedEvent } from '../events/test-case-status-changed.event';

export class TestCase extends AggregateRoot<TestCaseId> {
  private _name: string;
  private _description: string;
  private _status: TestStatus;
  private _priority: TestPriority;
  private _preconditions: string;
  private _steps: TestStep[];
  private _testSuiteId: string | null;

  private constructor(
    id: TestCaseId,
    name: string,
    description: string,
    status: TestStatus,
    priority: TestPriority,
    preconditions: string,
    steps: TestStep[] = [],
    testSuiteId: string | null = null,
  ) {
    super(id);
    this._name = name;
    this._description = description;
    this._status = status;
    this._priority = priority;
    this._preconditions = preconditions;
    this._steps = steps;
    this._testSuiteId = testSuiteId;

    this.validate();
    this.addDomainEvent(
      new TestCaseCreatedEvent(
        id.getValue(),
        name,
        description,
        status,
        priority,
        preconditions,
        steps,
      ),
    );
  }

  public static create(props: {
    name: string;
    description: string;
    status?: TestStatus;
    priority?: TestPriority;
    preconditions?: string;
    steps?: TestStep[];
    testSuiteId?: string;
  }): TestCase {
    return new TestCase(
      TestCaseId.create(),
      props.name,
      props.description,
      props.status || TestStatus.DRAFT,
      props.priority || TestPriority.MEDIUM,
      props.preconditions || '',
      props.steps || [],
      props.testSuiteId || null,
    );
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get status(): TestStatus {
    return this._status;
  }

  get priority(): TestPriority {
    return this._priority;
  }

  get preconditions(): string {
    return this._preconditions;
  }

  get steps(): TestStep[] {
    return [...this._steps];
  }

  get testSuiteId(): string | null {
    return this._testSuiteId;
  }

  public updateDetails(props: {
    name: string;
    description: string;
    priority: TestPriority;
    preconditions: string;
  }): void {
    this._name = props.name;
    this._description = props.description;
    this._priority = props.priority;
    this._preconditions = props.preconditions;

    this.validate();

    this.addDomainEvent(
      new TestCaseUpdatedEvent(
        this.id.getValue(),
        this._name,
        this._description,
        this._priority,
        this._preconditions,
        this._steps,
      ),
    );
  }

  public changeStatus(newStatus: TestStatus): void {
    if (this._status === newStatus) {
      return;
    }

    if (
      this._status === TestStatus.DEPRECATED &&
      (newStatus === TestStatus.ACTIVE || newStatus === TestStatus.DRAFT)
    ) {
      throw new Error('Cannot change status from DEPRECATED to ACTIVE or DRAFT');
    }

    const oldStatus = this._status;
    this._status = newStatus;

    this.addDomainEvent(
      new TestCaseStatusChangedEvent(
        this.id.getValue(),
        oldStatus,
        newStatus,
      ),
    );
  }

  public addStep(description: string, expectedResult: string): void {
    const order = this._steps.length + 1;
    const step = TestStep.create({
      order,
      description,
      expectedResult,
    });

    this._steps.push(step);
  }

  public updateStep(stepId: string, description: string, expectedResult: string): void {
    const stepIndex = this._steps.findIndex(step => step.id === stepId);

    if (stepIndex === -1) {
      throw new Error(`Step with id ${stepId} not found`);
    }

    const order = this._steps[stepIndex].order;
    const updatedStep = TestStep.create({
      id: stepId,
      order,
      description,
      expectedResult,
    });

    this._steps[stepIndex] = updatedStep;
  }

  public removeStep(stepId: string): void {
    const initialLength = this._steps.length;
    this._steps = this._steps.filter(step => step.id !== stepId);

    if (this._steps.length === initialLength) {
      throw new Error(`Step with id ${stepId} not found`);
    }

    this._steps = this._steps.map((step, index) =>
      TestStep.create({
        id: step.id,
        order: index + 1,
        description: step.description,
        expectedResult: step.expectedResult,
      })
    );
  }

  public assignToTestSuite(testSuiteId: string): void {
    this._testSuiteId = testSuiteId;
  }

  public removeFromTestSuite(): void {
    this._testSuiteId = null;
  }

  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('Test case name cannot be empty');
    }

    if (this._name.length > 100) {
      throw new Error('Test case name cannot exceed 100 characters');
    }
  }
}