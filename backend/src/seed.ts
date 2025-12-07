import { INestApplicationContext } from '@nestjs/common';
import { UsersService } from './modules/users/users.service';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

const seedData = async (app: INestApplicationContext) => {
  const userService = app.get(UsersService);

  await app.init();

  const email = 'admin@example.com';
  const password = '123456';

  try {
    await userService.create({
      email,
      password,
      name: 'Admin',
    });
  } catch (error) {
    console.error('Error creating ADMIN user', error);
  }
};

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  try {
    await seedData(appContext);
  } catch (error) {
    console.error('Error creating ADMIN', error);
    process.exit(1);
  } finally {
    await appContext.close();
  }
}
bootstrap();
