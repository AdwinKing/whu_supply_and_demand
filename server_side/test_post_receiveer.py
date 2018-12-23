from flask import Flask, request

app = Flask(__name__)

@app.route('/submitDemand', methods=['POST'])
def receiveDemandForm():
    print(request.form) # should display 'bar'
    return('Received !') # response to your request.

if __name__ == '__main__':
    app.run(debug=True, port=5000) #run app in debug mode on port 5000
