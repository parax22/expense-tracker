import { useState, useEffect } from "react";
import api from "../api";
import Expense from "../components/Expense"

function Home() {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [currency, setCurrency] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
      getExpenses();
    }, []);

    const getExpenses = () => {
        api
            .get("/api/expenses/")
            .then((res) => res.data)
            .then((data) => {
                setExpenses(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteExpense = (id) => {
        api
            .delete(`/api/expenses/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Expense deleted!");
                else alert("Failed to delete Expense.");
                getExpenses();
            })
            .catch((error) => alert(error));
    };

    const createExpense = (e) => {
        e.preventDefault();
        api
            .post("/api/expenses/", { description, category, currency, amount, date })
            .then((res) => {
                if (res.status === 201) alert("Expense created!");
                else alert("Failed to make expense.");
                getExpenses();
            })
            .catch((err) => alert(err));
    };

    return (
        <div>
            <div>
                <h2>Expenses</h2>
                {expenses.map((expense) => (
                    <Expense expense={expense} onDelete={deleteExpense} key={expense.id} />
                ))}
            </div>
            <h2>Create a Expense</h2>
            <form onSubmit={createExpense}>
                <label htmlFor="description">Description:</label>
                <br />
                <textarea
                    id="description"
                    name="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <br />
                <label htmlFor="category">Category:</label>
                <br />
                <input
                    id="category"
                    name="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                ></input>
                <br />
                <label htmlFor="currency">Currency:</label>
                <br />
                <input
                    id="currency"
                    name="currency"
                    required
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                ></input>
                <br />
                <label htmlFor="amount">Amount:</label>
                <br />
                <input
                    id="amount"
                    name="amount"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                ></input>
                <br />
                <label htmlFor="date">Date:</label>
                <br />
                <input
                    id="date"
                    name="date"
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                ></input>
                <br />
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    );
}

export default Home;