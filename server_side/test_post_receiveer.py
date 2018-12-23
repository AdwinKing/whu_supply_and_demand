from flask import Flask, request, jsonify
import mysql.connector

print("started")
# create database if it does not exist

mydb = mysql.connector.connect(
  host="localhost",
  user="test",
  passwd="test",
  auth_plugin='mysql_native_password'
)
mycursor = mydb.cursor()
mycursor.execute("CREATE DATABASE IF NOT EXISTS whu_demand_db")

# create table if it does not exist
mydb = mysql.connector.connect(
  host="localhost",
  user="test",
  passwd="test",
  database="whu_demand_db",
  auth_plugin='mysql_native_password'
)
mycursor = mydb.cursor(buffered=True)
mycursor.execute("CREATE TABLE IF NOT EXISTS demands (userid VARCHAR(255), timestamp VARCHAR(255), title VARCHAR(255), description VARCHAR(255), reward VARCHAR(255))")

print("database loaded successfully")


app = Flask(__name__)

@app.route('/submitDemand', methods=['POST'])
def receiveDemandForm():
    sql = "INSERT INTO demands (userid, timestamp, title, description, reward) VALUES (%s, %s, %s, %s, %s)"
    val = (request.form.get('userid'), request.form.get('timestamp'), request.form.get('demandTitle'), request.form.get('demandDescription'), request.form.get('demandReward'))
    mycursor.execute(sql, val)
    mydb.commit()

    print(request.form) # should display 'bar'
    print(request.form.get('userid'))
    print("Received post request")
    return 'Received !' # response to your request.

@app.route('/getLatestDemand', methods=['GET'])
def receiveDemandRequest():
    mycursor.execute("SELECT * FROM demands ORDER BY timestamp DESC ")
    myresult = mycursor.fetchone()
    print(type(myresult))
    print(myresult)
    #rv = jsonify({'userid': 'test', 'timestamp':'2018', 'title': 'testTitle', 'description': 'testDescription', 'reward': 'testReward'})
    rv = jsonify(myresult)
    rv.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return rv
    # return {'userid': 'test', 'timestamp':'2018', 'title': 'testTitle', 'description': 'testDescription', 'reward': 'testReward'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) #run app in debug mode on port 5000
