import { BodyParams, PathParams, UseBefore } from '@tsed/common';
import {Controller} from '@tsed/di';
import { NotFound } from '@tsed/exceptions';
import {Delete, Get, Post, Put} from '@tsed/schema';
import { User } from 'src/dto/User';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from '../../repositories/users/UsersRepository';
import { CustomAuth, CustomAuthMiddleware } from "../../middlewares/jwtAuthentication";


@Controller('/')
export class UsersController {

  private usersRepository: UsersRepository;

  constructor(userRepository: UsersRepository) {
    this.usersRepository = userRepository;
  }

  @Get('/')
  //@CustomAuth({role: "ADMIN", scopes: ["email"]})
  async getUsers(): Promise<User[]> {
    return await this.usersRepository.getAllUsers();
  }

  @Get('/:userId')
  async getUser(@PathParams('userId') userId: number): Promise<User | null> {
    return await this.usersRepository.getUser(userId);
  }

  @Put('/:userId')
  async put(@PathParams('userId') userId: number, @BodyParams() updatedUser: User): Promise<void> {
    
    const existingUser =  await this.usersRepository.getUser(userId);

    if (!existingUser) {
      throw new NotFound('User not found');
    }

    existingUser.name = updatedUser.name;
    existingUser.role = updatedUser.role;

    return await this.usersRepository.updateUser(userId, existingUser);
  }

  //@UseBefore(CustomAuthMiddleware)
  //@CustomAuth({role: "ADMIN", scopes: ["email"]})
  @Delete('/:userId')
  async delete(@PathParams('userId') userId: number): Promise<void>  {
    const existingUser =  await this.usersRepository.getUser(userId);

    if (!existingUser) {
      throw new NotFound('User not found');
    }

    return await this.usersRepository.deleteUser(existingUser.id!);
  }

  @Post('/register')
  async post(@BodyParams() user: User): Promise<{ token: string }>  {
    const userCreated = await this.usersRepository.saveUser(user);
    const token = sign({ id: userCreated.id, email: userCreated.email, role: userCreated.role }, '123456789');

    return { token };
  }
}
