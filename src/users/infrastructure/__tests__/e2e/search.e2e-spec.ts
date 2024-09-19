import { applyGlobalConfig } from "@/global-config";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserRepository } from "@/users/domain/repositories/user.repository";
import { UserDataBuilder } from "@/users/domain/testing/helpers/user-data-builder";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import request from 'supertest';
import { UsersModule } from "../../users.module";
import { instanceToInstance } from "class-transformer";
import { UsersController } from "../../users.controller";

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<UserRepository.Repository>('UserRepository');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
  });

  describe('GET /users', () => {

    it('should return the users ordered by createdAt', async () => {
      const createdAt = new Date();
      const entities: UserEntity[] = [];
      const arrange = Array(3).fill(UserDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(new UserEntity({
          ...element,
          email: `a${index}@a.com`,
          createdAt: new Date(createdAt.getTime() + index),
        }));
      });
      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      });
      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/users/?${queryParams}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toEqual({
        data: [...entities]
          .reverse()
          .map(item => instanceToInstance(UsersController.userToResponse(item))),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 15,
          lastPage: 1,
        }
      });
    });

    it('should return a error with 422 code when the query params is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/?fakeId=10')
        .expect(422)
        expect(res.body.error).toBe('Unprocessable Entity')
        expect(res.body.message).toEqual(['property fakeId should not exist'])
    });
  });
});