import { CreateUserError } from './CreateUserError';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

describe('Create User Use Case', () => {
  it('should be able create a new user', async () => {
    const { useCase, userMock } = makeSut();

    const result = await useCase.execute(userMock)
    expect(result).toHaveProperty('id')
  })

  it('should not be able to create a new user if already exists', async () => {
    const { useCase, userMock } = makeSut()

    await useCase.execute(userMock);
    expect(async () => {
      await useCase.execute(userMock);
    }).rejects.toBeInstanceOf(CreateUserError)
  });
})
function makeSut() {
  const inMemoryUsersRepository = new InMemoryUsersRepository();
  const useCase = new CreateUserUseCase(inMemoryUsersRepository);
  const userMock = {
    name: 'Fulano Silva',
    email: 'fulanosilva@email.com',
    password: '123456'
  }
  return { useCase, userMock };
}

