from flask import Flask, request, redirect, url_for, jsonify, send_file
import requests
import json
import random
from flask_cors import CORS

# import sys
# reload(sys)
# sys.setdefaultencoding('utf8')

app = Flask(__name__, static_url_path='/static')
CORS(app)

@app.route('/')
def hello():
    return "Welcome to Stock Portfolio Suggestion Engine"

stock_options = {
        'ethical': ['AAPL', 'ADBE', 'SBUX', 'GILD', 'GOOGL'],
        'growth': ['BIIB', 'AKRX', 'IPGP', 'SFIX', 'NFLX'],
        'index': ['VTI', 'IXUS', 'ILTB', 'VIS', 'KRE', 'VEU'],
        'quality': ['QUAL', 'SPHQ', 'DGRW', 'QDF'],
        'value': ['AAON', 'CTB', 'JNJ', 'GRUB', 'TTGT']
}

@app.route('/suggest',methods=['POST'])
def suggest_stocks():
    print ("suggest")
    req_data = request.get_json()
    strategy_1 = req_data['strategy_1']
    amount = req_data['amount']
    resp_obj = {} 
    stock_info = [] 

    options = []
    while len(options) < 3:
        temp = random.randint(0,4)
        if temp not in options:
            options.append(temp)

    #print options
    i = 0
    for option in options:
        stock_list1 = stock_options[strategy_1]
        if i == 0:
            perc = 0.36
            i=i+1
        elif i == 1:
            perc = 0.24
            i=i+1
        elif i == 2:
            perc = 0.4

        temp = {}
        try:
            resp_iex = requests.get('https://api.iextrading.com/1.0/stock/'+stock_list1[option]+'/quote')
            resp_aplha = requests.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+stock_list1[option]+'&outputsize=compact&apikey=8P5LW0AO6BRTVL3Y')
            if resp_iex.status_code == 200:
                r = resp_iex.json()
                r2 = resp_aplha.json()
                #print r['companyName']
                temp["symbolName"] = r['symbol']
                temp['companyName'] = r['companyName']
                temp['latestPrice'] = r['latestPrice']
                temp['changePercentage'] = float(r['changePercent'])*100
                #print perc
                temp['investAmount'] = amount*(perc)
                temp['weeklyData'] = r2['Time Series (Daily)']
                #print "**************END****************"
                stock_info.append(temp)
        except:
            print("some error")
            return "failed",500

    resp_obj['stock_info'] = stock_info
    return jsonify(resp_obj)



@app.route('/suggest2',methods=['POST'])

def suggest_stocks2():
    print ("suggest2")
    req_data = request.get_json()
    strategy_1 = req_data['strategy_1']
    strategy_2 = req_data['strategy_2']
    amount = req_data['amount']
    resp_obj = {}
    stock_info = []

    options = []
    while len(options) < 3:
        temp = random.randint(0,4)
        if temp not in options:
            options.append(temp)

    #print options
    i = 0
    for option in options:
        stock_list1 = stock_options[strategy_1]
        stock_list2 = stock_options[strategy_2]
        if i == 0:
            perc = 0.12
            i=i+1
        elif i == 1:
            perc = 0.18
            i = i+1
        elif i==2:
            perc = 0.4
            i = i+1

        
        try:
            temp = {}
            resp_iex = requests.get('https://api.iextrading.com/1.0/stock/'+stock_list1[option]+'/quote')
            resp_aplha = requests.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+stock_list1[option]+'&outputsize=compact&apikey=8P5LW0AO6BRTVL3Y')
            
            if resp_iex.status_code == 200:
                r = resp_iex.json()
                r2 = resp_aplha.json()
                #print r['companyName']
                temp["symbolName"] = r['symbol']
                temp['companyName'] = r['companyName']
                temp['latestPrice'] = r['latestPrice']
                temp['changePercentage'] = float(r['changePercent'])*100
                #print perc
                temp['investAmount'] = amount*(perc)
                temp['weeklyData'] = r2['Time Series (Daily)']
                #print "**************END****************"
                stock_info.append(temp)
            if i<3:
                temp = {}
                resp_iex = requests.get('https://api.iextrading.com/1.0/stock/'+stock_list2[option]+'/quote')
                resp_aplha = requests.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+stock_list2[option]+'&outputsize=compact&apikey=8P5LW0AO6BRTVL3Y')
                if resp_iex.status_code == 200:
                    r = resp_iex.json()
                    r2 = resp_aplha.json()
                    #print r['companyName']
                    temp["symbolName"] = r['symbol']
                    temp['companyName'] = r['companyName']
                    temp['latestPrice'] = r['latestPrice']
                    temp['changePercentage'] = float(r['changePercent'])*100
                    #print perc
                    temp['investAmount'] = amount*(perc)
                    temp['weeklyData'] = r2['Time Series (Daily)']
                    #print "**************END****************"
                    stock_info.append(temp)
                    #print len(stock_info)
        except:
            print("some error")
            return "failed",500

    resp_obj['stock_info'] = stock_info
    return jsonify(resp_obj)

if __name__ == '__main__':
    app.run(host='0.0.0.0')