import { prisma } from "../src/database"
import supertest from 'supertest';
import itemFactory from "../factorys/itemFactory"
import app from "../src/app"

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "items"`;
});


describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const item = await itemFactory()

    const resposta = await supertest(app).post("/items").send(item)


    expect(resposta.status).toBe(201)
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const item = await itemFactory()

    await supertest(app).post("/items").send(item)
    const resposta = await supertest(app).post("/items").send(item)

    expect(resposta.status).toBe(409)
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const item = await itemFactory()

    await supertest(app).post("/items").send(item)
    const itens = await supertest(app).get("/items").send()

    expect(itens.status).toBe(200)
    expect(itens.body).not.toBeNull();
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const item = await itemFactory()

    const itemCadastrado = await supertest(app).post("/items").send(item)
    const itemEncontrado = await supertest(app).get(`/items/${itemCadastrado.body.id}`).send()

    expect(itemEncontrado.status).toBe(200)
    expect(itemEncontrado.body).toMatchObject({})
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {

    const itemEncontrado = await supertest(app).get('/items/-1').send()

    expect(itemEncontrado.status).toBe(404)
  });
});



afterAll(async () => {
  await prisma.$disconnect();
});
