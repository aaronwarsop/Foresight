import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const PortfolioPieChart = ({ portfolioAnalysis }) => {
  const { isDarkMode } = useTheme();

  if (!portfolioAnalysis || !portfolioAnalysis.holdings || portfolioAnalysis.holdings.length === 0) {
    return (
      <div className={`rounded-lg p-5 shadow-md min-h-[400px] ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Portfolio Composition
        </h2>
        <div className="flex flex-col items-center justify-center py-16">
          <p className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No holdings yet
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Add stocks to see your portfolio breakdown
          </p>
        </div>
      </div>
    );
  }

  const colors = [
    '#4a9eff',
    '#66bb6a',
    '#ffb74d',
    '#ef5350',
    '#ba68c8',
    '#4dd0e1',
    '#fff176',
    '#a1887f',
    '#90a4ae',
    '#f06292',
  ];

  const chartData = portfolioAnalysis.holdings.map((holding, index) => ({
    name: holding.stock.symbol,
    value: parseFloat(holding.currentValue || 0),
    color: colors[index % colors.length],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / parseFloat(portfolioAnalysis.totalCurrentValue || 1)) * 100).toFixed(1);
      return (
        <div className={`p-3 rounded-lg shadow-lg ${isDarkMode ? 'bg-navy-700 text-gray-100' : 'bg-white text-gray-800'}`}>
          <p className="font-bold">{data.name}</p>
          <p className="text-sm">£{data.value.toFixed(2)}</p>
          <p className="text-sm">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-lg p-5 shadow-md min-h-[400px] ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Portfolio Composition
      </h2>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 px-2">
        {portfolioAnalysis.holdings.map((holding, index) => {
          const percentage = ((parseFloat(holding.currentValue || 0) / parseFloat(portfolioAnalysis.totalCurrentValue || 1)) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center mb-2">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {holding.stock.symbol} - {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioPieChart;
