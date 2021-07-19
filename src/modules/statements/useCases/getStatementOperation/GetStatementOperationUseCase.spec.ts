import "reflect-metadata";

import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { OperationType, Statement } from '@modules/statements/entities/Statement';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

async function makeUser(): Promise<User> {
  return await createUserUseCase.execute({
    name: "Fulano da Silva",
    email: "fulano@email.com",
    password: "123456",
  });
}

async function makeDeposit(user_id:string, amount = 100): Promise<Statement> {
  return await createStatementUseCase.execute({
    user_id,
    amount,
    type: OperationType.DEPOSIT,
    description: "test",
  });
}
describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("should throw UserNotFound when using a user falsy", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "invalidUser",
        statement_id: "any_value",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("should throw StatementNotFound when using a statement falsely", async () => {
    const user = await makeUser();
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "any_value",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });


  it('should be able to return a statement when to receive correct data', async () => {
    const user = await makeUser();
    const deposit = await makeDeposit(user.id!)

    const statement = await getStatementOperationUseCase.execute({user_id: user.id!, statement_id: deposit.id!})

    expect(statement).toHaveProperty('id');
    expect(statement).toHaveProperty('user_id');
    expect(statement).toHaveProperty('amount');
    expect(statement).toHaveProperty('type');
    expect(statement).toHaveProperty('description');
    expect(statement.id).toBe(deposit.id);
    expect(statement.user_id).toBe(user.id);
  });
});
