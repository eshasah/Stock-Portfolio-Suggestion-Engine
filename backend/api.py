from flask import Flask, render_template, request
# import pandas as pd
# import numpy as np
import yfinance as yf
from datetime import datetime as dt
import json


# Configure the app
app = Flask(__name__)

investment_strategies = {
    "ETHICAL": ["AAPL", "NSRGY", "ADBE"],
    "GROWTH": ["FB", "NFLX", "GOOG"],
    "INDEX": ["VOO", "SPY", "QQQ"],
    "QUALITY": ["MDLZ", "CVS", "ED"],
    "VALUE": ["BAC", "KHC", "VZ"]
}


@app.route('/')
def hello_world():
    """
    Serves the main template file.
    You probably do NOT want to modify this.
    """
    return render_template('home.html')


@app.after_request
def add_header(r):
    """
    Disable all caching.
    You probably do NOT want to modify this.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


#####################################
# REST backend interface

"""
Returns an array of stock objects. 
Each stock object has these attributes: P/E Ratio (decimal), amount_to_spend (decimal), currentPrice (decimal), 
and history (array of the last 7 days of prices. Will usually be length of 5 because stock market is closed on weekends)

Paramters for Post Request:
"amount":  the numerical value for how much a user is willing to invest
"strategies: an array of up two strategies (case insensitive). Must be from the following: Ethical, Growth, Index, Quality, Value

Example Request Body:
{
    "amount": 5000,
    "strategies": ["Growth", "Quality"]
}

Example Response Body:
{
    "CVS": {
        "P/E_Ratio": 16.220982,
        "amount_to_spend": 903.42,
        "currentPrice": 92.93,
        "history": [  89.05999755859375,  88.77999877929688,  89.98999786376953,  90.87000274658203,  92.6500015258789 ]
    },
    "ED": {
        "P/E_Ratio": 24.158768,
        "amount_to_spend": 856.16,
        "currentPrice": 81.56,
        "history": [   77.63999938964844,   77.94000244140625,   78.69000244140625,   80.52999877929688,   81.3499984741211]
    },
    "FB": {
        "P/E_Ratio": 23.100758,
        "amount_to_spend": 862.46,
        "currentPrice": 322.81,
        "history": [324.4599914550781,  310.6000061035156,  310.3900146484375,  306.8399963378906,  317.8699951171875 ]
    },
    "GOOG": {
        "P/E_Ratio": 28.522036,
        "amount_to_spend": 830.18,
        "currentPrice": 2960.73,
        "history": [  2849.0400390625,  2832.360107421875,  2875.530029296875,  2850.409912109375,  2875.929931640625]
    },
    "MDLZ": {
        "P/E_Ratio": 19.551098,
        "amount_to_spend": 883.6,
        "currentPrice": 61.41,
        "history": [58.939998626708984,58.560001373291016, 59.459999084472656,      60.2599983215332,      61.41999816894531  ]
    },
    "NFLX": {
        "P/E_Ratio": 56.404297,
        "amount_to_spend": 664.18,
        "currentPrice": 625.58,
        "history": [  641.9000244140625,  617.77001953125,  616.469970703125, 602.1300048828125, 612.6900024414062 ]
    }
}

"""


@app.route('/stocks', methods=['POST'])
def allocate_stocks():
    # print(request)
    amount = request.json["amount"]
    # amount = request.form.get("amount")
    # amount = int(amount)

    strategies = request.json["strategies"]
    #strategies = request.form.getlist("strategies")
    # strategies = (strategies)
    # print(amount)
    # print(strategies)
    # print(len(strategies))
    valid_strategies = ["ETHICAL", "GROWTH", "INDEX", "QUALITY", "VALUE"]

    if amount <= 4999:
        return "Amount must be greater than 0", 400
    if len(strategies) == 0 or len(strategies) > 2:
        return "Strategies array must be of either size 1 or size 2", 400
    else:
        for strategy in strategies:
            if strategy.upper() not in valid_strategies:
                return "Strategies must be from the following: Ethical, Growth, Index, Quality, Value.", 400

    current = dt.now()
    year = current.year
    month = current.month
    day = current.day
    # print(year, month, day)
    stocks = {}
    totalPE = 0
    for strategy in strategies:
        for stock in investment_strategies[strategy.upper()]:
            # print(stock)
            data = yf.download(stock,
                               f'{year}-{month if day - 7 > 0 else month - 1}-{day - 7 if day - 7 > 0 else 30 - (day - 7)}',
                               f'{year}-{month}-{day}')
            info = yf.Ticker(stock).info
            stocks[stock] = {"currentPrice": info["regularMarketPrice"], "peRatio": info["trailingPE"],
                             "history": data["Close"].to_list()}
            totalPE += info["trailingPE"]

    # how much money to allocate to each stock
    for current_stock in stocks:
        amount_to_spend = round(((1 - (stocks[current_stock]["peRatio"] / totalPE)) / (len(stocks) - 1)) * amount, 2)
        # print(current_stock, totalPE, stocks[current_stock]["peRatio"], amount, amount_to_spend)
        # print(current_stock)
        stocks[current_stock]["amount_to_spend"] = amount_to_spend
    return json.dumps(stocks)


if __name__ == '__main__':
    app.run(debug=True)

