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
mycursor.execute("CREATE TABLE IF NOT EXISTS demands (demandID int NOT NULL AUTO_INCREMENT, userID VARCHAR(255), timestamp VARCHAR(255), title VARCHAR(255), description VARCHAR(255), reward SMALLINT UNSIGNED, applicants VARCHAR(255), acceptedApplicant VARCHAR(255), isFinished TINYINT DEFAULT 0, PRIMARY KEY (demandID))")
# demandid, userid, timestamp, title, description, reward, tags, applicants, isaccepted,

print("database loaded successfully")


app = Flask(__name__)

# severe security issues here, later updates needed
@app.route('/submitDemand', methods=['POST'])
def receiveDemandForm():
    sql = "INSERT INTO demands (userID, timestamp, title, description, reward) VALUES (%s, %s, %s, %s, %s)"
    val = (request.form.get('userID'), request.form.get('timestamp'), request.form.get('demandTitle'), request.form.get('demandDescription'), request.form.get('demandReward'))
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

@app.route('/addApplicant', methods=['POST'])
def addApplicant():
    demandID = request.form.get('demandID')
    applicant = request.form.get('userID')
    sql = "SELECT applicants FROM demands WHERE demandID={0}".format(demandID)
    existing_applicants = mycursor.execute(sql)
    print(existing_applicants)
    sql = "UPDATE demands SET applicants = {0} WHERE demandID = {1}".format(existing_applicants + ' ' + applicant, demandID)
    mycursor.execute(sql)
    return 'updated applicants'

@app.route('/chooseApplicant', methods=['POST'])
def chooseApplicant():
    demandID = request.form.get('demandID')
    applicant = request.form.get('applicant')
    sql = "UPDATE demands SET acceptedApplicant = {0} WHERE demandID = {1}".format(applicant, demandID)
    mycursor.execute(sql)
    return 'choosed ' + applicant

@app.route('/confirmFinished', methods=['POST'])
def confirmFinished():
    demandID = request.form.get('demandID')
    sql = "UPDATE demands SET isFinished = {0} WHERE demandID = {1}".format(1, demandID)
    mycursor.execute(sql)
    return 'comfirmed '

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) #run app in debug mode on port 5000
