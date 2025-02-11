import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Card, CardContent, CardActions, Typography } from "@mui/material";

function Expense({ expense, onDelete }) {
    const formattedDate = new Date(expense.date).toLocaleDateString("en-US");

    return (
        <Card className="expense">
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    { formattedDate }
                </Typography>
                <Typography variant="h6" component="div">
                    { expense.description }
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                    { expense.category_name }
                </Typography>
                <Typography variant="body2">
                    { expense.currency } { expense.amount }
                </Typography>
            </CardContent>
            <CardActions>
                <Button startIcon={<EditIcon/>} size="small" color="secondary">
                    Edit
                </Button>
                <Button startIcon={<DeleteIcon/>} size="small" color="error" onClick={() => onDelete(expense.id)}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}

export default Expense;