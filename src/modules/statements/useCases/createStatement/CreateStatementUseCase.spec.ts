import "reflect-metadata";

import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { User } from "@modules/users/entities/User";
import { CreateStatementError } from "./CreateStatementError";
import { OperationType } from "@modules/statements/entities/Statement";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

async function makeUser(): Promise<User> {
  return await createUserUseCase.execute({
    name: "Fulano da Silva",
    email: "fulano@email.com",
    password: "123456",
  });
}

describe("Create Statement Use Case", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();

    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("should throw UserNotFound when using a user falsy", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "invalidUser",
        amount: 1,
        type: OperationType.DEPOSIT,
        description: "test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should throw InsufficientFunds if balance less than the amount", async () => {
    const user = await makeUser();
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id!,
        amount: 1,
        type: OperationType.WITHDRAW,
        description: "test",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should be able to deposit to a user", async () => {
    const user = await makeUser();
    const amount = 100;
    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id!,
      amount,
      type: OperationType.DEPOSIT,
      description: "test",
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
    expect(statementOperation).toHaveProperty("type");
    expect(statementOperation).toHaveProperty("amount");
    expect(statementOperation).toHaveProperty("description");
    expect(statementOperation.amount).toBe(amount);
  });
});
