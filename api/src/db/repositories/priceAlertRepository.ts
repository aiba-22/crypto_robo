import db from "../db";

export class PriceAlertRepository {
  private db;

  constructor(dbInstance = db) {
    this.db = dbInstance;
  }

  async findByUserId(userId: number) {
    return await this.db("price_alert").where({ user_id: userId }).first();
  }

  async create({
    userId,
    conditions,
  }: {
    userId: number;
    conditions: {
      price: number;
      isUpperLimit: boolean;
      symbol: string;
    };
  }) {
    await this.db("price_alert").insert({
      conditions,
      user_id: userId,
    });
  }

  async update({
    id,
    conditions,
  }: {
    id: number;
    conditions: {
      price: number;
      isUpperLimit: boolean;
      symbol: string;
    };
  }) {
    await this.db("price_alert")
      .where({ id })
      .update({
        conditions: JSON.stringify(conditions),
        updated_at: new Date(),
      });
  }
}
