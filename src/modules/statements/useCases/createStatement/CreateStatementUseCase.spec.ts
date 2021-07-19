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
});
