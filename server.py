from flask import Flask, jsonify, redirect, render_template, request, session, url_for
from pysondb import db
import hashlib
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

adminDB = db.getDb("./databases/adminDB.json")
interviewsDB = db.getDb("./databases/interviewsDB.json")

def validateSession():
    if 'user' in session:
        adminInfo = adminDB.getByQuery({'email' : session['user']})
        if len(adminInfo) > 0:
            return True
    return False

@app.route('/', methods = ['GET','POST'])
def indexPage():
    if request.method == 'POST':
        interviewCode = request.json
        if len(interviewsDB.getByQuery({'interviewCode' : interviewCode['interviewCode']})) == 1:
            return jsonify({'status' : 'ok', 'msg' : 'Interview Code Verified'})
        else:
            return jsonify({'status' : 'error','msg' : 'Interview Not Found'})
    else:
        return render_template('index.html')

@app.route('/adminSignup', methods = ['GET', 'POST'])
def adminSignupPage():
    if request.method == 'POST':
        signupFormData = request.json
        if len(adminDB.getByQuery({'email': signupFormData['email']})) == 0:
            hashPassword = hashlib.sha256(signupFormData['password'].encode()).hexdigest()
            signupFormData['password'] = hashPassword
            adminDB.add(signupFormData)
            return jsonify({'status' : 'ok', 'msg' : 'Account Created'})
        else:
            return jsonify({'status' : 'error','msg' : 'Account Exists'})
    else:
        return render_template('adminSignup.html')

@app.route('/adminLogin', methods = ['GET', 'POST'])
def adminLoginPage():
    if request.method == 'POST':
        loginFormData = request.json
        adminInfo = adminDB.getByQuery({'email' : loginFormData['email']})
        if len(adminInfo) > 0:
            tempHashPassword = hashlib.sha256(loginFormData['password'].encode()).hexdigest()
            if adminInfo[0]['password'] == tempHashPassword:
                session['user'] = loginFormData['email']
                return jsonify({'status' : 'ok','msg' : "Login Success"})
            else:
                return jsonify({'status' : 'error','msg' : "Incorrect Password"})
        else: 
            return jsonify({'status' : 'error','msg' : "Account Doesn't Exist"})
    else:
        if validateSession():
            return redirect(url_for('manageInterview'))
        return render_template('adminLogin.html')

@app.route('/updatePassword', methods = ['GET', 'POST'])
def updateAdminPassword():
    if validateSession():
        adminInfo = adminDB.getByQuery({'email' : session['user']})[0]
        if request.method == 'POST':
            updatePasswordFormData = request.json
            tempHashPassword = hashlib.sha256(updatePasswordFormData['oldPassword'].encode()).hexdigest()
            if tempHashPassword == adminInfo['password']:
                newPassword = hashlib.sha256(updatePasswordFormData['newPassword'].encode()).hexdigest()
                adminDB.updateById(adminInfo['id'], {'password' : newPassword})
                return jsonify({'status' : 'ok','msg' : "Password Updated"})
            else:
                return jsonify({'status' : 'error','msg' : "Incorrect Current Password"})
        else:
            return redirect(url_for('updateUserProfile'), 302)
    else:
        return redirect(url_for('adminLoginPage'), 302)

@app.route('/updateProfile', methods = ['GET', 'POST'])
def updateUserProfile():
    if validateSession():
        adminInfo = adminDB.getByQuery({'email' : session['user']})[0]
        if request.method == 'POST':
            profileUpdateFormData = request.json
            adminDB.updateById(adminInfo['id'], {'username' : profileUpdateFormData['username']})
            return jsonify({'status' : 'ok','msg' : "Profile Updated"})
        else:
            adminInfo['password'] = ''
            return render_template('updateProfile.html', adminInfo = adminInfo)
    else:
        return redirect(url_for('adminLoginPage'), 302)

@app.route('/manageInterview', methods = ['GET'])
def manageInterview():
    if validateSession():
        interviewsData = interviewsDB.getByQuery({'admin' : session['user']})
        return render_template('manageInterview.html', interviewsData = interviewsData)
    else:
        return redirect(url_for('adminLoginPage'), 302)

@app.route('/updateInterview/<interviewID>', methods = ['GET', 'POST'])
def updateInterview(interviewID):
    if validateSession():
        if request.method == 'POST':
            updateInterviewFormData = request.json
            interviewData = interviewsDB.getByQuery({'interviewCode' : updateInterviewFormData['interviewCode']})[0]
            interviewsDB.deleteById(interviewData['id'])
            updateInterviewFormData['admin'] = session['user']
            interviewsDB.add(updateInterviewFormData)
            return jsonify({'status' : 'ok','msg' : "Interview Updated"})
        else:
            interviewData = interviewsDB.getByQuery({'interviewCode' : interviewID})[0]
            return render_template('updateInterview.html', interviewData = interviewData)
    else:
        return redirect(url_for('adminLoginPage'), 302)

@app.route('/deleteInterview/<interviewID>', methods = ['DELETE'])
def deleteInterview(interviewID):
    if validateSession():
        try:
            interviewData = interviewsDB.getByQuery({'interviewCode' : interviewID, 'admin': session['user']})
            interviewsDB.deleteById(interviewData[0]['id'])
            return jsonify({'status' : 'ok','msg' : "Interview Deleted"})
        except:
            return jsonify({'status' : 'error','msg' : "Interview Not Found"})
    else:
        return redirect(url_for('adminLoginPage'), 302)

@app.route('/createInterview', methods = ['GET', 'POST'])
def createInterviewPage():
    if request.method == 'POST' and validateSession():
        createInterviewFormData = request.json
        if len(interviewsDB.getByQuery({'interviewCode' : createInterviewFormData['interviewCode']})) == 0:
            createInterviewFormData['admin'] = session['user']
            interviewsDB.add(createInterviewFormData)
            return jsonify({'status' : 'ok','msg' : "Interview Created"})
        else:
            return jsonify({'status' : 'error','msg' : "Interview with this code already exist"}) 
    else:
        if validateSession():
            return render_template('createInterview.html')
        else:
            return redirect(url_for('adminLoginPage'))
        
@app.route('/registerInterview/<interviewID>')
def registerInterviewPage(interviewID):
    return render_template('interviewApplication.html')

@app.route('/results')
def resultsPage():
    return render_template('results.html')

@app.route('/adminLogout')
def logoutAdmin():
    session.pop('user', None)
    return redirect(url_for('adminLoginPage'))

app.run(host='0.0.0.0')