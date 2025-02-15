import Expense from '../common/Expense';
import { Button, Carousel } from '../../ui';

function RecurringExpenses({ expenses, onDelete, onEdit, onCreate }) {
    return (
        <div className="p-4 border-round h-full">
            <div className="flex flex-wrap justify-content-around align-items-center">
                <h2>Recurring Expenses</h2>
                <Button
                    text
                    label="Add Recurring Expense"
                    icon="pi pi-plus"
                    onClick={onCreate}
                    style={{ marginTop: '1rem' }}
                />
            </div>
            {
                expenses.length > 0 ? (
                    <Carousel
                        className="w-full h-full"
                        value={expenses}
                        numVisible={3}
                        numScroll={1}
                        responsiveOptions={[
                            { breakpoint: '1440px', numVisible: 2, numScroll: 1 },
                            { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
                        ]}
                        circular
                        itemTemplate={(expense) => (
                            <Expense expense={expense} isRecurring={true} onDelete={onDelete} onEdit={onEdit} onCreate={onCreate} />
                        )}
                    />
                ) : (
                    <p>No recurring expenses found.</p>
                )
            }
        </div>
    );
}

export default RecurringExpenses;