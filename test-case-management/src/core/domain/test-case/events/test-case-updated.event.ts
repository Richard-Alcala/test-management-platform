import { DomainEvent } from '../../common/domain-event';
import { TestPriority } from '../value-objects/test-priority.enum';
import { TestStep } from '../value-objects/test-step.vo';

export class TestCaseUpdatedEvent extends DomainEvent {
  constructor(
    public readonly testCaseId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly priority: TestPriority,
    public readonly preconditions: string,
    public readonly steps: TestStep[],
  ) {
    super();
  }
}