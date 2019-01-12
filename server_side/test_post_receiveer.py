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
mycursor.execute("CREATE TABLE IF NOT EXISTS demands (demandID int NOT NULL AUTO_INCREMENT, userID VARCHAR(255), createdTime DATETIME DEFAULT GETDATE(), title VARCHAR(255), description VARCHAR(255), reward SMALLINT UNSIGNED, applicants VARCHAR(255), acceptedApplicant VARCHAR(255), isFinished TINYINT DEFAULT 0, PRIMARY KEY (demandID))")
# demandid, userid, timestamp, title, description, reward, tags, applicants, isaccepted,
mycursor.execute("CREATE TABLE IF NOT EXISTS messages (message VARCHAR(255), createdTime DATETIME DEFAULT GETDATE(), fromUser VARCHAR(255), toUser VARCHAR(255))")
# message, createdTime, fromUser, toUser
print("database loaded successfully")


app = Flask(__name__)

# severe security issues here, later updates needed
@app.route('/submitDemand', methods=['POST'])
def submitDemand():
    sql = "INSERT INTO demands (userID, title, description, reward) VALUES (%s, %s, %s, %s)"
    val = (request.form.get('userID'), request.form.get('demandTitle'), request.form.get('demandDescription'), request.form.get('demandReward'))
    mycursor.execute(sql, val)
    mydb.commit()

    print(request.form) # should display 'bar'
    print(request.form.get('userID'))
    print("Received post request")
    return 'Received !' # response to your request.

@app.route('/getLatestDemand', methods=['GET'])
def getLatestDemand():
    mycursor.execute("SELECT * FROM demands ORDER BY createdTime DESC ")
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
    if mycursor.rowcount == 1:
        print("last sql operation affected 1 row")
        mydb.commit()
        return 'updated applicants'
    else:
        return 'failed'

@app.route('/chooseApplicant', methods=['POST'])
def chooseApplicant():
    demandID = request.form.get('demandID')
    applicant = request.form.get('applicant')
    sql = "UPDATE demands SET acceptedApplicant = {0} WHERE demandID = {1}".format(applicant, demandID)
    mycursor.execute(sql)
    if mycursor.rowcount == 1:
        print("last sql operation affected 1 row")
        mydb.commit()
        return 'choosed ' + applicant
    else:
        return 'failed'

@app.route('/confirmFinished', methods=['POST'])
def confirmFinished():
    demandID = request.form.get('demandID')
    sql = "UPDATE demands SET isFinished = {0} WHERE demandID = {1}".format(1, demandID)
    mycursor.execute(sql)
    if mycursor.rowcount == 1:
        print("last sql operation affected 1 row")
        mydb.commit()
        return 'comfirmed '
    else:
        return 'failed'

@app.route('/sendMessage', methods=['POST'])
def sendMessage():
    message = request.form.get('message')
    fromUser = request.form.get('fromUser')
    toUser = request.form.get('toUser')
    sql = "INSERT INTO messages (message, fromUser, toUser) VALUES (%s, %s, %s)"
    mycursor.execute(sql, (message, fromUser, toUser))
    if mycursor.rowcount == 1:
        print("last sql operation affected 1 row")
        mydb.commit()
        return '200'
    else:
        return 'failed'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) #run app in debug mode on port 5000
