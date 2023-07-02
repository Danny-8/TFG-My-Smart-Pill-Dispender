'''
    Functions for the data manipulation
'''

import json
import datetime


def readData():
    with open('data.json', 'r') as archivo:
        data = json.load(archivo)    
    return data

def searchPerson(data, name):
    for person in data['people']:
        if person['name'] == name:
            return person
    return None

def checkDate(startDate, durationDays):
    endDate = datetime.date.fromisoformat(startDate) + datetime.timedelta(days=durationDays)
    if endDate > datetime.date.today():
        return True
    else:
        return False

def getTime():
    current_time = datetime.datetime.now().time()
    if current_time < datetime.time(12):
        return "Morning"
    elif current_time < datetime.time(18):
        return "Afternoon"
    else:
        return "Night"

def editFrequency(medication, name, newLastDispense):
    data = readData()
    person = searchPerson(data, name)
    for med in person['medication']:
        if med['pillName'] == medication['pillName']:
            med['lastDispense'].append(newLastDispense)
    with open('data.json', 'w') as archivo:
        json.dump(data, archivo, indent=4)

def checkFrequency(frequency, lastDispense):
    time = getTime()
    if time not in frequency:
        return False, time
    elif time in lastDispense:
        return False, time
    else:
        return True, time

def checkData(personalData, name):
    dispense = []
    for medication in personalData['medication']:
        date = checkDate(medication['startDate'], medication['durationDays'])
        if date == True:
            status, time = checkFrequency(medication['frequency'], medication['lastDispense'])
            if status == True:
                dispense.append([medication['dispenser'], medication['dose'], medication['pillName']])
                editFrequency(medication, name, time)
    return dispense



def checkMedication():
    data = readData()
    for person in data['people']:
        for medication in person['medication']:
            date = checkDate(medication['startDate'], medication['durationDays'])
            if date == True:
                status, time = checkFrequency(medication['frequency'], medication['lastDispense'])
                if status == True:
                    return True
    return False

def checkDispensers():
    data = readData()
    dispensers = []
    for dispenser in data['dispensers']:
        if dispenser['quantity'] < 10:
            dispensers.append(dispenser['pillName'])
    if dispensers.length == 0:
        return False
    else:
        return True
