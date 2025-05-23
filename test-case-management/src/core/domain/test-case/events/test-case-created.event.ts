import { DomainEvent } from '../../common/domain-event';
import { TestStatus } from '../value-objects/test-status.enum';
import { TestPriority } from '../value-objects/test-priority.enum';
import { TestStep } from '../value-objects/test-step.vo';

export class TestCaseCreatedEvent extends DomainEvent {
  constructor(
    public readonly testCaseId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly status: TestStatus,
    public readonly priority: TestPriority,
    public readonly preconditions: string,
    public readonly steps: TestStep[],
  ) {
    super();
  }
}