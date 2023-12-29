import { expect, it, beforeAll, afterAll, describe, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../src/app";

describe("Transactions Routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex:migration migrate:rollback --all");
    execSync("npm run knex:m-latest");
  });

  it("Should be able to user can create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "new_transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new_transaction",
        amount: 5000,
        type: "credit",
      });

    const cookie = createTransactionsResponse.get("Set-Cookie");

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookie)
      .expect(200);

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "new_transaction",
        amount: 5000,
      }),
    ]);
  });

  it("should be able to get a specific transaction", async () => {
    const createTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new_transaction",
        amount: 5000,
        type: "credit",
      });

    const cookie = createTransactionsResponse.get("Set-Cookie");

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookie)
      .expect(200);

    const transactionId = listTransactionResponse.body.transactions[0].id;

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "new_transaction",
        amount: 5000,
      })
    );
  });

  it("should be able to get summary", async () => {
    const createTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "credit_transaction",
        amount: 5000,
        type: "credit",
      });

    const cookie = createTransactionsResponse.get("Set-Cookie");

    await request(app.server).post("/transactions").set("Cookie", cookie).send({
      title: "debit_transaction",
      amount: 2000,
      type: "debit",
    });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookie)
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({ amount: 3000 });
  });
});
