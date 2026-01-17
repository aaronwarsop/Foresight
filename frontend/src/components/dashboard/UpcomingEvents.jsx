import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const UpcomingEvents = ({ portfolio }) => {
  const { isDarkMode } = useTheme();

  const getUpcomingEvents = () => {
    const events = [];

    portfolio.forEach((holding) => {
      const stock = holding.stock;

      if (stock.nextDividendDate) {
        events.push({
          type: 'dividend',
          symbol: stock.symbol,
          date: new Date(stock.nextDividendDate),
        });
      }

      if (stock.nextEarningsDate) {
        events.push({
          type: 'earnings',
          symbol: stock.symbol,
          date: new Date(stock.nextEarningsDate),
        });
      }
    });

    // Sort by date and take the 5 closest events
    return events
      .filter((event) => event.date >= new Date())
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getEventIcon = (type) => {
    return type === 'dividend' ? '💰' : '📊';
  };

  const getEventColor = (type) => {
    return type === 'dividend' ? 'text-green-500' : 'text-blue-500';
  };

  const events = getUpcomingEvents();

  return (
    <div className={`rounded-lg p-5 shadow-md min-h-[200px] ${isDarkMode ? 'bg-navy-800' : 'bg-white'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        Upcoming Events
      </h2>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <p className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No upcoming events
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Dividend and earnings dates will appear here
          </p>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={index}
              className={`flex items-center py-3 border-b ${isDarkMode ? 'border-navy-600' : 'border-gray-100'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isDarkMode ? 'bg-navy-600' : 'bg-gray-100'}`}>
                <span className="text-xl">{getEventIcon(event.type)}</span>
              </div>
              <div className="flex-1">
                <p className={`text-base font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {event.symbol}
                </p>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {event.type === 'dividend' ? 'Dividend Payment' : 'Earnings Release'}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${getEventColor(event.type)}`}>
                  {formatDate(event.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
