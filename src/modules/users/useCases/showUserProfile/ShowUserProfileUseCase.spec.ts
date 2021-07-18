import { User } from '@modules/users/entities/User';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show User Profile Use Case', () => {

  async function createUser(): Promise<User> {
    const userDTO: ICreateUserDTO = {
      email: "fulano@email.com",
      password: "123456",
      name: "Fulano da Silva",
    };
    const user = await createUserUseCase.execute(userDTO);
    return user;
  }

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
  })

  it('should be able return user info', async () => {
    const user = await createUser();
    const result = await showUserProfileUseCase.execute(user.id!)
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('email')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('password')

  })
})
