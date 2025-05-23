import { DomainEvent } from '../../common/domain-event';
import { TestStatus } from '../value-objects/test-status.enum';

export class TestCaseStatusChangedEvent extends DomainEvent {
  constructor(
    public readonly testCaseId: string,
    public readonly oldStatus: TestStatus,
    public readonly newStatus: TestStatus,
  ) {
    super();
  }
}