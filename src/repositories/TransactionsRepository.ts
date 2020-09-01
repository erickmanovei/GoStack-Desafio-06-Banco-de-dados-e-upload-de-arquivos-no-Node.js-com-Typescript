import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionRepository = getRepository(Transaction);
    const transactions = await transactionRepository.find();

    const { income, outcome } = transactions.reduce(
      (accumulator: Balance, actualValue: Transaction) => {
        if (actualValue.type === 'income') {
          accumulator.income += actualValue.value;
        } else {
          accumulator.outcome += actualValue.value;
        }
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;
    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
