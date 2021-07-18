import "reflect-metadata";
import { CreateUserUseCase } from "./../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User Use Case", () => {

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
  });

  async function createUser(): Promise<ICreateUserDTO> {
    const userDTO: ICreateUserDTO = {
      email: "fulano@email.com",
      password: "123456",
      name: "Fulano da Silva",
    };
    await createUserUseCase.execute(userDTO);
    return userDTO;
  }

  it("should be able sign in correctly", async () => {
    const user = await createUser();
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
  });

  it("should not be able sign in with incorrect email", async () => {
    const user = await createUser();
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'incorrect@email.com',
        password: user.password,
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able sign in with incorrect password", async () => {
    const user = await createUser();
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectpassword',
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

});
