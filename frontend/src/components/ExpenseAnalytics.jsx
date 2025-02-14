import { useEffect, useState } from 'react';
import { Chart, Card, Avatar } from '../ui';
import api from '../api';
import dayjs from 'dayjs';

function ExpenseAnalytics({ analytics }) {
    const preferredCurrency = localStorage.getItem('preferred_currency') || 'USD';
    const [pieChartData, setPieChartData] = useState({});
    const [pieChartOptions, setPieChartOptions] = useState({});
    const [lineChartData, setLineChartData] = useState({});
    const [categories, setCategories] = useState({});
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        api.get('/api/categories/').then(response => {
            const categoryMap = response.data.reduce((categoriesNames, category) => {
                categoriesNames[category.id] = category.name;
                return categoriesNames;
            }, {});
            setCategories(categoryMap);
        });
    }, []);

    useEffect(() => {
        if (Object.keys(categories).length === 0) return;

        const documentStyle = getComputedStyle(document.documentElement);
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();

        const filteredData = analytics.filter(entry =>
            entry.month === currentMonth && entry.year === currentYear
        );

        const labels = filteredData.map(entry => categories[entry.category] || 'Desconocido');
        const dataValues = filteredData.map(entry => parseFloat(entry.total_amount));

        const backgroundColors = [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--purple-500')
        ];

        const hoverBackgroundColors = [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--red-400'),
            documentStyle.getPropertyValue('--purple-400')
        ];

        setPieChartData({
            labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors.slice(0, labels.length),
                hoverBackgroundColor: hoverBackgroundColors.slice(0, labels.length)
            }]
        });

        setPieChartOptions({
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        });

        const months = [...Array(6)].map((_, i) => dayjs().subtract(i, 'month').format('MMM YYYY')).reverse();
        const monthlyData = months.map(monthLabel => {
            const monthIndex = dayjs(monthLabel, 'MMM YYYY').month() + 1;
            const year = dayjs(monthLabel, 'MMM YYYY').year();
            return analytics
                .filter(entry => entry.month === monthIndex && entry.year === year)
                .reduce((sum, entry) => sum + parseFloat(entry.total_amount), 0);
        });

        setLineChartData({
            labels: months,
            datasets: [{
                label: 'Monthly Spending',
                data: monthlyData,
                borderColor: documentStyle.getPropertyValue('--green-500'),
                backgroundColor: documentStyle.getPropertyValue('--green-300'),
                fill: true
            }]
        });

        const totalSpent = dataValues.reduce((sum, value) => sum + value, 0).toFixed(2);
        const highestCategory = filteredData.reduce((max, entry) => entry.total_amount > max.total_amount ? entry : max, filteredData[0]);
        const highestCategoryName = categories[highestCategory?.category] || 'N/A';
        const totalPayments = filteredData.reduce((sum, entry) => sum + entry.total_payments, 0);
        const averageSpending = (totalSpent / filteredData.length || 0).toFixed(2);

        setSummary([
            { title: "Total Spent", value: `${totalSpent} ${preferredCurrency}` },
            { title: "Highest Category", value: `${highestCategoryName} (${highestCategory?.total_amount || 0} ${preferredCurrency})` },
            { title: "Total Payments", value: totalPayments },
            { title: "Average Spending", value: `${averageSpending} ${preferredCurrency}` },
            { title: "Categories Tracked", value: filteredData.length }
        ]);

    }, [analytics, categories]);

    return (
        <div className="grid text-center">
            <div className="col-12 lg:col-3">
                <h2>Expenses Summary</h2>
                <div className="justify-content-center text-center">
                    <Card className="m-auto w-12 lg:w-10 md:w-6">
                        <Avatar icon="pi pi-money-bill" size="large"/>
                        <h3>Current Month</h3>
                        <ul>
                            {summary.map((item, index) => (
                                <li className="text-left mb-2" style={{ listStyleType: 'none' }} key={index}>
                                    <strong>{item.title}: </strong>
                                    {item.value}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
            <div className="col-12 lg:col-9">
                <h2>Graph Statistics</h2>
                <div className="grid gap-2 justify-content-center xl:w-12 lg:w-12 md:w-6 sm:w-10 m-auto">
                    <div className='justify-content-center text-center surface-card border-round w-12 lg:w-5 p-2'>
                        <h3>Monthly Categories</h3>
                        <Chart type="pie" data={pieChartData} options={pieChartOptions} className="w-6 m-auto"/>
                    </div>
                    <div className='justify-content-center text-center surface-card border-round w-12 lg:w-5 p-2'>
                        <h3>Spending Trend (Last 6 Months)</h3>
                        <Chart type="line" data={lineChartData}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpenseAnalytics;
