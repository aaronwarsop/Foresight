<template>
    <div class="bg-backgroundSecondary rounded-[8px] p-4 text-white grid grid-cols-2">
        <div>
            <div class="text-textPrimary">Account Value: ${{ accountValue }}</div>
            <div class="text-textSecondary">Invested Value: ${{ investedValue }}</div>
        </div>

        <div>
            <div>Total Return: ${{ totalReturnValue }} ({{ totalReturnPercentage }}%)</div>
            <div>Daily Return: ${{ dailyReturnValue }} ({{ dailyReturnPercentage }}%)</div>
        </div>
    </div>
</template>

<script setup>
    const { accountValue, investedValue, totalReturnValue, totalReturnPercentage, dailyReturnValue, dailyReturnPercentage, updateAccountValue, updateInvestedValue, updateReturns } = accountVal();

    // setting some filler values for now
    updateAccountValue(150);
    updateInvestedValue(100);
    updateReturns();
</script>