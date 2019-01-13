from flask import Flask, request
import subprocess
import base64

app = Flask(__name__)


@app.route('/sendEmail', methods=['POST'])
def sendEmail():
    data_json = request.get_json(force=True)
    # print(type(data.json))
    # print(data.json)
    emailAddress = data_json.get('emailAddress')
    # print(type(emailAddress))
    print(emailAddress)
    encodedData = base64.b64encode(emailAddress.encode())
    # cmd1 = "echo \"Click below link to verify your email. If you have not sign up for luojiaexchange, please ignore this email.\n http://172.93.37.77/clickVerificationLink?data=" + encodedData.decode() + "\""
    # cmd2 = "mail -a \"From: LuojiaExchange <noreply@adwinjoy.me> \" -a \" Subject: Email Verification\" " + emailAddress
    # process1 = subprocess.Popen(cmd1.split(), stdout=subprocess.PIPE)
    # process2 = subprocess.Popen(cmd2.split(), stdin=process1.stdout)
    # output, error = process2.communicate()
    cmd = "echo \"Click below link to verify your email. If you have not sign up for luojiaexchange, please ignore this email.\n http://172.93.37.77:5000/clickVerificationLink?data=" + encodedData.decode() + "\" |  mail -a \"From: LuojiaExchange <noreply@adwinjoy.me> \" -s \" Email Verification \" " + emailAddress
    output = subprocess.check_output(cmd,shell=True)
    print(output)
    return 'success'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) #run app in debug mode on port 5000
