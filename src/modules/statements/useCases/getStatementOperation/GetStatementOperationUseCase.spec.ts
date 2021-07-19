import "reflect-metadata";

import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;

async function makeUser(): Promise<User> {
  return await createUserUseCase.execute({
    name: "Fulano da Silva",
    email: "fulano@email.com",
    password: "123456",
  });
}
describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();

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
});
