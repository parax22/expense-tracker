import { useState } from "react";
import { ExpenseService } from "../services/api/expenseService";

export const useExpense = () => {
    const expenseService = new ExpenseService();
    const [expenses, setExpenses] = useState([]);
    const [recurringExpenses, setRecurringExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    const getExpenses = async () => {
        setLoading(true);
        try {
            const response = await expenseService.getAll();
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRecurringExpenses = async () => {
        setLoading(true);
        try {
            const response = await expenseService.getAllRecurring();
            setRecurringExpenses(response.data);
        } catch (error) {
            console.error("Error fetching recurring expenses:", error);
        } finally {
            setLoading(false);
        }
    };

    const createExpense = async (expense) => {
        try {
            const response = await expenseService.create(expense);
            if (response.status === 201) {
                await getExpenses();
                await getRecurringExpenses();
                return true;
            }
        } catch (error) {
            console.error("Error creating expense:", error);
        }
        return false;
    };

    const editExpense = async (id, updatedExpense) => {
        try {
            const response = await expenseService.update(id, updatedExpense);
            if (response.status === 200) {
                await getExpenses();
                await getRecurringExpenses();
                return true;
            }
        } catch (error) {
            console.error("Error updating expense:", error);
        }
        return false;
    };

    const deleteExpense = async (id) => {
        try {
            const response = await expenseService.delete(id);
            if (response.status === 204) {
                await getExpenses();
                await getRecurringExpenses();
                return true;
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
        return false;
    };

    return { expenses, recurringExpenses, loading, getExpenses, getRecurringExpenses, createExpense, editExpense, deleteExpense };
};