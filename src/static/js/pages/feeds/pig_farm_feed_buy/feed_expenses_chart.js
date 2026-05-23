// FeedExpenseChartCanvas.js
'use strict';

export function FeedExpenseChart(input_settings) {
    const thisObj           = this;
    const navigation        = input_settings.navigation;
    const elemDivContainer  = input_settings.elemDivContainer;
    
    
    this.render = function(feedBuyList) {
        const monthlyData = processMonthlyData(feedBuyList);
        
        if (monthlyData.length === 0) {
            elemDivContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No feed expense data available</div>';
            return;
        }
        
        const maxExpense = Math.max(...monthlyData.map(m => m.total), 1);
        const yAxisMax = Math.ceil(maxExpense / 1000) * 1000;
        
        const canvasId = `feed-chart-${Date.now()}`;
        
        const html = `
            <div class="feed-expense-chart" style="width: 100%; padding: 10px 0;">
                <h4 style="margin: 0 0 12px 0; font-size: 1rem; color: #333;">📊 Feed Expenses (Last 3 Months)</h4>
                <canvas id="${canvasId}" style="width: 100%; height: 220px;"></canvas>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; padding: 0 10px;">
                    <span style="font-size: 11px; color: #999;">${monthlyData[0]?.monthName || ''}</span>
                    <span style="font-size: 11px; color: #999;">${monthlyData[1]?.monthName || ''}</span>
                    <span style="font-size: 11px; color: #999;">${monthlyData[2]?.monthName || ''}</span>
                </div>
            </div>
        `;
        
        elemDivContainer.innerHTML = html;
        
        // Draw canvas chart
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            drawChart(canvas, monthlyData, yAxisMax);
        }
    };
    
    
    function drawChart(canvas, monthlyData, yAxisMax) {
        const ctx = canvas.getContext('2d');
        const width = canvas.parentElement.clientWidth - 40;
        const height = 200;
        canvas.width = width;
        canvas.height = height;
        
        const barWidth = (width / monthlyData.length) * 0.6;
        const barSpacing = (width / monthlyData.length) * 0.4;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw bars
        for (let i = 0; i < monthlyData.length; i++) {
            const barHeight = (monthlyData[i].total / yAxisMax) * height;
            const x = i * (barWidth + barSpacing) + barSpacing / 2;
            const y = height - barHeight;
            
            // Bar
            ctx.fillStyle = '#2e7d64';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Value on top of bar
            ctx.fillStyle = '#2e7d64';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`₱${monthlyData[i].total.toLocaleString()}`, x + barWidth / 2, y - 3);
        }
        
        // Draw y-axis labels
        ctx.fillStyle = '#999';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`₱${yAxisMax.toLocaleString()}`, width - 5, 10);
        ctx.fillText('₱0', width - 5, height - 5);
    }
    
    
    function processMonthlyData(feedBuyList) {
        const now = new Date();
        const months = [];
        
        for (let i = 2; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                key: `${date.getFullYear()}-${date.getMonth() + 1}`,
                monthName: date.toLocaleString('default', { month: 'short' }),
                total: 0
            });
        }
        
        for (const purchase of feedBuyList) {
            const date = new Date(purchase.pf_feed_buy.date_buy);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const monthData = months.find(m => m.key === monthKey);
            if (monthData) {
                monthData.total += purchase.pf_feed_buy.total_feed_cost;
            }
        }
        
        return months;
    }
}
