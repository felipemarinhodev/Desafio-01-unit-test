import "reflect-metadata"

import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository'
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';

let statementRepositoryInMemory: InMemoryStatementsRepository
let usersRepositoryInMemory: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

describe('Get Balance Use Case', () => {

  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory)
  })
  it('should throw GetBalanceError when user is falsy', async () => {
    expect( async () => {
      await getBalanceUseCase.execute({ user_id: 'invalidUserID'})
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
