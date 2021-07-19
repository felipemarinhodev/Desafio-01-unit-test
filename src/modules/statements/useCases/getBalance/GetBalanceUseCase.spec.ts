import "reflect-metadata";

import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { OperationType } from "@modules/statements/entities/Statement";
import { User } from '@modules/users/entities/User';

let statementRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

async function makeUser(): Promise<User> {
  return await createUserUseCase.execute({
    name: "Fulano da Silva",
    email: "fulano@email.com",
    password: "123456",
  });
}

async function makeDeposit(user_id: string, amount: number) {
  await createStatementUseCase.execute({
    user_id,
    type: OperationType.DEPOSIT,
    amount,
    description: "Teste unitário",
  });
}

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      usersRepositoryInMemory
    );

    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("should throw GetBalanceError when user is falsy", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "invalidUserID" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("should be able to recover the balance of a user correctly", async () => {
    const userCreate = await makeUser()

    const amount = 1000
    await makeDeposit(userCreate.id!, amount);

    const balance = await getBalanceUseCase.execute({ user_id: userCreate.id!})
    expect(balance).toHaveProperty('statement')
    expect(balance).toHaveProperty('balance')
    expect(balance.balance).toBe(amount)
  });
});
