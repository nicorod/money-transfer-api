import { BodyParams, PathParams } from '@tsed/common';
import {Controller} from '@tsed/di';
import { NotFound } from '@tsed/exceptions';
import {Delete, Get, Post, Put} from '@tsed/schema';
import { User } from 'src/dto/User';

import { UsersRepository } from '../../repositories/users/UsersRepository';

@Controller('/users')
export class UsersController {

  private usersRepository: UsersRepository;

  constructor(userRepository: UsersRepository) {
    this.usersRepository = userRepository;
  }

  @Get('/')
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


  @Delete('/:userId')
  async delete(@PathParams('userId') userId: number): Promise<void>  {
    const existingUser =  await this.usersRepository.getUser(userId);

    if (!existingUser) {
      throw new NotFound('User not found');
    }

    return await this.usersRepository.deleteUser(existingUser.id!);
  }

  @Post('/')
  async post(@BodyParams() user: User) {
    return await this.usersRepository.saveUser(user);
  }
}
