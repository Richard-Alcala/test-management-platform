import { ValueObject } from '../../common/value-object';
import { v4 as uuidv4 } from 'uuid';

export class TestStep extends ValueObject {
  readonly id: string;
  readonly order: number;
  readonly description: string;
  readonly expectedResult: string;

  private constructor(props: {
    id?: string;
    order: number;
    description: string;
    expectedResult: string;
  }) {
    super();
    this.id = props.id || uuidv4();
    this.order = props.order;
    this.description = props.description;
    this.expectedResult = props.expectedResult;
    this.validate();
  }

  public static create(props: {
    order: number;
    description: string;
    expectedResult: string;
    id?: string;
  }): TestStep {
    return new TestStep(props);
  }

  private validate(): void {
    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Test step description cannot be empty');
    }

    if (!this.expectedResult || this.expectedResult.trim().length === 0) {
      throw new Error('Test step expected result cannot be empty');
    }
    if (this.order < 1) {
      throw new Error('Test step order must be a positive number');
    }
  }
}