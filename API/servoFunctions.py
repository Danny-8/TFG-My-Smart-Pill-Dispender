'''
    Functions for the servo motor
'''

import RPi.GPIO as GPIO
import time
from dataFunctions import readData

def move_servo(pin):
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(pin, GPIO.OUT)

    servo = GPIO.PWM(pin, 50)
    servo.start(0)

    servo.ChangeDutyCycle(12.5)
    time.sleep(0.25)
    servo.ChangeDutyCycle(7.5)
    time.sleep(0.25)
    servo.ChangeDutyCycle(2.5)
    time.sleep(0.25)
    servo.ChangeDutyCycle(7.5)
    time.sleep(0.25)
    servo.ChangeDutyCycle(12.5)
    time.sleep(0.25)

    servo.stop()
    GPIO.cleanup()

def callServo(dispenser, dose):
    data = readData()
    for d in data["dispensers"]:
        if (d["dispenser"] == dispenser):
            for i in range(dose):
                move_servo(d["pin"])
                time.sleep(0.5)