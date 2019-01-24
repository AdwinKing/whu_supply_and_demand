import flask
from flask import Flask, request, jsonify
from datetime import datetime
import requests
import base64
import mysql.connector

import os
CURRENT_DIRECTORY = os.path.dirname(os.path.realpath(__file__))

# get public ip address
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ipAddress = s.getsockname()[0]
print(ipAddress)
s.close()
SERVER_PORT = 5000
SERVER_URL = "http://" + ipAddress + ":" + str(SERVER_PORT)
AVATAR_FOLDER = "avatars"


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
mycursor.execute("CREATE TABLE IF NOT EXISTS demands (demandID int NOT NULL AUTO_INCREMENT, userID VARCHAR(255), createdTime DATETIME DEFAULT NOW(), title VARCHAR(255), description VARCHAR(255), reward SMALLINT, applicants VARCHAR(255), acceptedApplicant VARCHAR(255), isFinished TINYINT DEFAULT 0, isClosed TINYINT DEFAULT 0, PRIMARY KEY (demandID))")
# demandid, userid, timestamp, title, description, reward, tags, applicants, isaccepted,
mycursor.execute("CREATE TABLE IF NOT EXISTS messages (message VARCHAR(255), createdTime DATETIME DEFAULT NOW(), fromUser VARCHAR(255), toUser VARCHAR(255))")
# message, createdTime, fromUser, toUser
mycursor.execute("CREATE TABLE IF NOT EXISTS userInfo (userID VARCHAR(255), nickName VARCHAR(255), emailAddress VARCHAR(255), isVerified TINYINT DEFAULT 0, modifiedTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)")
# userID, emailAddress, modifiedTime

# add testUser
mycursor.execute("INSERT INTO userInfo (userID, nickName) SELECT \"testUser\", \"wyc\" WHERE NOT EXISTS (SELECT userID FROM userInfo WHERE userID = \"testUser\")")
if mycursor.rowcount == 1:
    print("last sql operation affected 1 row")
    mydb.commit()

print("database loaded successfully")


app = Flask(__name__, static_url_path='')

def sendVerificationEmail(emailAddress):
    # to do
    dictToSend = {'emailAddress': emailAddress}
    result = requests.post('http://184.170.213.85:5000/sendEmail', json=dictToSend)
    print(result)


@app.route('/test', methods=['GET'])
def test():
    return '42'

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



@app.route('/getAvatar/<path:path>', methods=['GET'])
def getAvatar(path):
    # userID = request.args.get('userID')
    # sql = "SELECT avatarPath FROM userInfo WHERE userID = \"{0}\"".format(userID)
    # print(sql)
    # print(CURRENT_DIRECTORY + '/' + AVATAR_FOLDER + '/' + userID + '.png')
    return flask.send_from_directory(AVATAR_FOLDER, path)
    # return flask.send_file(CURRENT_DIRECTORY + '/' + AVATAR_FOLDER + '/testUser.png')

# @app.route('/getNickName', methods=['GET'])
# def getNickName():
#     userID = request.args.get('userID')
#     sql = "SELECT nickName FROM userInfo WHERE userID = \"{0}\"".format(userID)
#     print(sql)
#     mycursor.execute(sql)
#     nickName = mycursor.fetchone()
#     print(nickName)
#     return nickName

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

@app.route('/getSpecificDemand', methods=['GET'])
def getSpecificDemand():
    demandID = request.args.get('demandID')
    sql = "SELECT userID, title, description, reward, applicants, acceptedApplicant, isFinished, isClosed FROM demands WHERE demandID = {0}".format(demandID)
    print(sql)
    mycursor.execute(sql)
    myResult = mycursor.fetchone()
    print(myResult)
    rv = jsonify(myResult)
    rv.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return rv

@app.route('/getDemandBrief', methods=['GET'])
def getDemandBrief():
    userID = request.args.get('userID')
    scrollCount = int(request.args.get('scrollCount'))
    order = request.args.get('order')
    isPrivate = request.args.get('isPrivate')
    searchText = request.args.get('searchText')
    sql = "SELECT demands.demandID, demands.userID, demands.title, demands.reward, demands.createdTime, userInfo.nickName FROM demands INNER JOIN userInfo ON demands.userID=userInfo.userID WHERE demands.isClosed = 0 "
    print(type(isPrivate))
    print(isPrivate)
    if isPrivate == 'true':
        sql += " AND demands.userID = \"{0}\" ".format(userID)
    else:
        sql += " AND demands.acceptedApplicant IS NULL "
    print(type(searchText))
    print("searchText:" + searchText)
    if searchText != None and searchText != '':
        keywords = searchText.split()
        for word in keywords:
            sql += " AND (INSTR(demands.title, \"{0}\") > 0 OR INSTR(demands.description, \"{0}\") > 0) ".format(word)
    if order == 'time_asc':
        sql += " ORDER BY demands.createdTime ASC "
    elif order == 'time_desc':
        sql += " ORDER BY demands.createdTime DESC "
    elif order == 'reward_asc':
        sql += " ORDER BY demands.reward ASC "
    elif order == 'reward_desc':
        sql += " ORDER BY demands.reward DESC "

    sql += " LIMIT {0},10".format(scrollCount * 10)
    print(sql)
    mycursor.execute(sql)
    if scrollCount >= 0:
        myResult = mycursor.fetchall()
        print(myResult)
        rv = jsonify(myResult)
        rv.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        return rv
    else:
        return 'failure'



@app.route('/submitEmail', methods=['POST'])
def submitEmail():
    userID = request.form.get('userID')
    emailAddress = request.form.get('emailAddress')
    sql = "SELECT EXISTS(SELECT * FROM userInfo WHERE userID = \"{0}\")".format(userID)
    mycursor.execute(sql)
    myResult = mycursor.fetchone()
    print(type(myResult))
    print(myResult)
    if myResult[0] == 0:
        sql = "INSERT INTO userInfo (userID, emailAddress) VALUES (%s, %s)"
        mycursor.execute(sql, (userID, emailAddress))
    else:
        sql = "UPDATE userInfo SET emailAddress = \"{0}\" WHERE userID = \"{1}\"".format(emailAddress, userID)
        mycursor.execute(sql)


    if mycursor.rowcount == 1:
        print("last sql operation affected 1 row")
        mydb.commit()
        sendVerificationEmail(emailAddress)
        return 'success'
    else:
        print("insert failure")
        return 'failure'

@app.route('/clickVerificationLink', methods=['GET'])
def clickVerificationLink():
    encodedData = request.args.get('data')
    emailAddress = base64.b64decode(encodedData).decode()
    sql = "SELECT modifiedTime FROM userInfo WHERE emailAddress = \"{0}\"".format(emailAddress)
    mycursor.execute(sql)
    modifiedTime = mycursor.fetchone()
    print(type(modifiedTime))
    print(modifiedTime)
    if modifiedTime == None:
        return "Something went wrong"
    current = datetime.now()
    interval = modifiedTime[0] - current
    if interval.day >= 1:
        print("the activation link is out of date")
        return "link is out of date"
    sql = "UPDATE userInfo SET isVerified = 1 WHERE emailAddress = \"{0}\"".format(emailAddress)
    mycursor.execute(sql)
    if mycursor.rowcount == 1:
        print("last sql operation affected 1 row")
        mydb.commit()
        return 'success'
    else:
        print("verification failure")
        return 'failure'



@app.route('/addApplicant', methods=['POST'])
def addApplicant():
    demandID = request.form.get('demandID')
    applicant = request.form.get('userID')
    sql = "SELECT applicants FROM demands WHERE demandID={0}".format(demandID)
    print(sql)
    existing_applicants = mycursor.execute(sql)
    print(existing_applicants)
    if existing_applicants == None:
        existing_applicants = ''
    sql = "UPDATE demands SET applicants = \"{0}\" WHERE demandID = {1}".format(existing_applicants + ' ' + applicant, demandID)
    print(sql)
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
    sql = "UPDATE demands SET acceptedApplicant = \"{0}\", isTaken = 1 WHERE demandID = {1}".format(applicant, demandID)
    print(sql)
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
    sql = "UPDATE demands SET isFinished = 1, isClosed = 1 WHERE demandID = {0}".format(demandID)
    mycursor.execute(sql)
    if mycursor.rowcount == 1:
        print("last sql operation affected 1 row")
        mydb.commit()
        return 'comfirmed '
    else:
        return 'failed'

@app.route('/cancelDemand', methods=['POST'])
def cancelDemand():
    demandID = request.form.get('demandID')
    sql = "UPDATE demands SET isClosed = 1 WHERE demandID = {0}".format(demandID)
    mycursor.execute(sql)
    if mycursor.rowcount == 1:
        print("last sql operation affected 1 row")
        mydb.commit()
        return 'success'
    else:
        return 'failure'


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
    app.run(debug=True, host='0.0.0.0', port=SERVER_PORT) #run app in debug mode on port 5000
