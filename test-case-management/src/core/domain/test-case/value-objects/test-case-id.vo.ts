import { ValueObject } from '../../common/value-object';
import { v4 as uuidv4 } from 'uuid';

export class TestCaseId extends ValueObject {
  private readonly value: string;

  private constructor(id?: string) {
    super();
    this.value = id || uuidv4();
  }

  public static create(id?: string): TestCaseId {
    return new TestCaseId(id);
  }

  public getValue(): string {
    return this.value;
  }
}