const  admin = require('firebase-admin');

const googleApplicationCredentials  = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "jobie-f23ef",
    "private_key_id": "a4ce3c1278c84737accf04d5a16f4ed9fb756f28",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC85uCbk0AFtevU\nScV4B+m12FkIBRWzNM3QmkJO+DnoYFJCqnOELhlTt6T4s0TqkcMjfUmOga3l716Y\nUaYKgyU85FkgqX3/rEweOJ4/mOnA/BXzFUtArVoU/KzkRWr/dYUp64hOmec+H0oq\nCWhtt0IVaB4/JaT1a20px2djTAFcoCcrD7wwCO7vCHC2HSHe7OBmPE7w5zjtpE8M\nx2yBrqzlEWJcvnWmQKBsEZJm+BjFRLkz9ESYoDTJQ6vBMum6rMv7WBKSAJntEnnL\nFzjJXjm92yqfk8eSxOJGMBOnVAFzGWmkewXOdWLdu7XoHfy3yB3QeVVqWShFtz1H\nFTqr7toxAgMBAAECggEAHaPPuAmFoP/CW60hnhZbw6Ez7bq32hvIdC6oMIeUCn6x\nRELw3Nt2NOPFWmftQdhnjouA6FU3tIhNHEhUwySAdMqoTiQvdYJoRSZWykgo3BOR\n3Bz0vFbBojZivcSYp9xy7bjGdVLXwlsa13gMxIkIhkmv0/JeV6B+C0aoVcpzZ5V3\nGcifFe5EDHCUbZadUHv2ypcaxt9yeoH8noAsalJWC2tgD1LLrlPWMGqDYga8vqil\nzbOEdPPDzKdM4MdRdaaXp7kceSrjC/f+zjvdESZ/+fnS07+SzEVbBxXrNCfHmI56\nzl0OIiZ1vuAdmyhWybr9QQsh6TXrvhENyGG0MV7yOwKBgQD/Is/YbRBCWUTg74kx\nYW812zHfOzqFFBHOW7FmxJ3jVjT7e9hxReQmQhhS+DAmk1aWJc0+5R4otSJP5RNV\nWptPW4yfpYHGjGLy8wgyq0dyPaH8bK9PZBTwtvEnk+rKowfijj+iSEBsL0GSRapT\nPhc8S+qIMmrjp/zm4FkX+YyR2wKBgQC9iqTzRRn+GDgXIlxZ5tXu26MPDiAVFkJM\n1N2JofYHSprXXKOJ9MB+H9DIH0izYQ0KerUnCmPvO0AaerVRQkvzCshrVhl9O2AO\nDTa2KZ4tG0MlxSDki868SR0VJHw6SRopULKEDYWJ/mw4G6ztF74kX2aPVmGuw8oI\nj2r77eAf4wKBgQDexf7F8zUnOdsyrPUV8QWx+NrrGERYvtVtYhLcsQFL55ILpG+x\nOF2mKkAi8iLZC/2mzQsRx+01jjOPn23qMVs7R6zaGSHfw+UCTcLyuyt/TOGMDzpk\nD/dY1+RpsnZoyUGxSJO3l27pB7oxhjLazHRtabw3gA5lCeGBlpM0o+lh0QKBgQCK\nf5SobgXgNbJGtUTmLFaGgtdTWO74eZtYqPJ4b3BnQ4yBcZ/OXpmJj5XvpWxqJrBw\nx9k2/dCoLpNYxfFXvyngHjD0vaVCbPBzVBR2Z1K9gv49yx2N4trdmk8188MSk/gZ\n2G2ZMIgznUVWemKRnJfD3DIE6wnVuhsWxjVWgSsUIQKBgQChNrx+mc+KAIDCCZs7\nopy4Pl/2tNV/Lco+vkvWcjswF/rS7OEswuEwe8nIenjq+vW4JeJBmOpV+qCmYWvC\n2fd4uvr1gMMDVi0vH0twoz47ymwO348SJowFR6SHQRmU22VvZll4Cn53NmVDetyk\nAw4N3EDy/JPM+fmpaALmpNhNZw==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ckla9@jobie-f23ef.iam.gserviceaccount.com",
    "client_id": "114773952582870568077",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ckla9%40jobie-f23ef.iam.gserviceaccount.com"
  }
  ),
  databaseURL: process.env.MONGODB_URL
});

module.exports = admin.messaging();
