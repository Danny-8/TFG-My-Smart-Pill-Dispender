'''
    Functions for the ultrasonic sensor
'''

import RPi.GPIO as GPIO
import time

def isStarting():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings (False)
    TRIG = 23
    ECHO = 24
    GPIO.setup(TRIG, GPIO.OUT)
    GPIO.setup(ECHO, GPIO.IN)
    GPIO.output(TRIG, False)

    GPIO.output(TRIG, True)
    time.sleep(0.00001)
    GPIO.output (TRIG, False)

    while GPIO.input(ECHO)==0:
        pulse_start = time.time()

    while GPIO.input(ECHO)==1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    distance = round(distance, 2)

    print ("Distance:", distance, "cm")
    if (distance <= 10):
        return True
    return False
