import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

describe('Create User Use Case', () => {
  it('should be able create a new user', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const useCase = new CreateUserUseCase(inMemoryUsersRepository)

    const user = {
      name: 'Fulano Silva',
      email: 'fulanosilva@email.com',
      password: '123456'
    }

    const result = await useCase.execute(user)
    expect(result).toHaveProperty('id')
  })

})
