'''
    Functions for the Leds
'''
import RPi.GPIO as GPIO

pins = {"red": 24, "green": 22}

def startLed(name):
    pin = pins[name]
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.HIGH)

def stopLed(name):
    pin = pins[name]
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.LOW)
    GPIO.cleanup()
