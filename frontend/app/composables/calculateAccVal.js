export const accountVal = () => {
    const accountValue = useState('accountValue', () => 0);
    const openingAccountValue = useState('openingAccountValue', () => 0);
    const date = useState('date', () => '');
    const investedValue = useState('investedValue', () => 0);
    const deposit = useState('deposit', () => 0);
    const totalReturnValue = useState('totalReturnValue', () => 0);
    const dailyReturnValue = useState('dailyReturnValue', () => 0);
    const totalReturnPercentage = useState('totalReturn', () => 0);
    const dailyReturnPercentage = useState('dailyReturn', () => 0);

    const checkNewDay = () => {
        const today = new Date().toISOString().split('T')[0];
        if (date.value !== today) {
            date.value = today;
            openingAccountValue.value = accountValue.value;
        }
    }

    const updateReturns = () => {
        checkNewDay();

        totalReturnValue.value = Math.floor(accountValue.value - investedValue.value);
        totalReturnPercentage.value = Math.floor(((accountValue.value / investedValue.value) -1) * 100);

        dailyReturnValue.value = Math.floor(accountValue.value - openingAccountValue.value);
        dailyReturnPercentage.value = Math.floor(((accountValue.value / openingAccountValue.value) -1) * 100);
    }

    if (import.meta.client) {
        setInterval(updateReturns, 5000);
    }

    const updateAccountValue = (value) => {
        accountValue.value = value;
        updateReturns();
    }

    const updateInvestedValue = (value) => {
        investedValue.value = value;
        updateReturns();
    }

    return {
        accountValue,
        openingAccountValue,
        date,
        investedValue,
        deposit,
        totalReturnValue,
        totalReturnPercentage,
        dailyReturnValue,
        dailyReturnPercentage,
        updateAccountValue,
        updateInvestedValue,
        updateReturns
    }
}