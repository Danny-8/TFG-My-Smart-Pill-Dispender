import threading
import time

from dataFunctions import readData, searchPerson, checkData, checkMedication, checkDispensers
from ultrasonicFunctions import isStarting
from servoFunctions import callServo
from cameraFunctions import recognizePerson
from ledFunctions import startLed, stopLed
from audioFunctions import playAudio, textToAudio



'''
    STATE MACHINE
'''

state = "waiting"
def run_main_state_machine():
    global state
    start = False
    data = None
    startLed("red")
    while True:
        if state == "waiting":
            # Esperar a que se detecte la mano
            start = isStarting()
            time.sleep(1)
            if start == True:
                stopLed("red")
                state = "starting"
            pass

        elif state == "starting":
            # Reproducir audio de bienvenida
            startLed("green")
            playAudio("bienvenido.wav")

            # Detectar cara
            name = recognizePerson()
            if name == "unknown":
                playAudio("no_detectado1.wav")
                name = recognizePerson()
                if name == "unknown":
                    playAudio("no_detectado2.wav")
                    stopLed("green")
                    startLed("red")
                    state = "waiting"
                    continue

            playAudio("detectado.wav")
            textToAudio(f"{name}")
            print(name)

            # Leer datos del paciente
            data = readData()

            # Buscar a la persona dentro de la data
            personalData = searchPerson(data, name)
            if personalData == None:
                playAudio("no_registrado.wav")
                stopLed("green")
                startLed("red")
                state = "waiting"
                continue

            time.sleep(1)
            playAudio("registrado.wav")

            # Verificar si hay medicamentos que dispensar
            dispensePills = checkData(personalData, name)
            if len(dispensePills) == 0:
                playAudio("sin_medicamentos.wav")
                stopLed("green")
                startLed("red")
                state = "waiting"
                continue

            state = "dispensing"
            pass

        elif state == "dispensing":
            # Reproducir audio de dispensar medicamentos
            time.sleep(1)
            playAudio("medicamentos.wav")
            for dispenser, dose, name in dispensePills:
                textToAudio(f"{dose}")
                if dose == 1:
                    playAudio("pastilla_de.wav")
                else:
                    playAudio("pastillas_de.wav")
                textToAudio(f"{name}")
            
            # Dispensar medicamentos
            for dispenser, dose, name in dispensePills:
                callServo(dispenser, dose)

            playAudio("tomar_medicacion.wav")
            stopLed("green")
            startLed("red")
            state = "waiting"
            pass



state2 = "waiting"
def run_secondary_state_machine():
    global state2
    while True:
        if state2 == "waiting":
            # Esperar 4 horas
            time.sleep(14400)
            state2 = "checking"
            pass

        elif state2 == "checking":
            medication = checkMedication()
            dispensers = checkDispensers()
            if medication == True and dispensers == True:
                state2 = "warning"
            else:
                state2 = "waiting"
                continue
            
            pass

        elif state2 == "warning":
            if medication == True:
                playAudio("alarma_tomar_medicamentos.wav")
                playAudio("alarma_tomar_medicamentos.wav")
            if dispensers == True:
                playAudio("alarma_rellenar_dispensadores.wav")
                playAudio("alarma_rellenar_dispensadores.wav")
            state2 = "waiting"
            
            pass

        
main_thread = threading.Thread(target=run_main_state_machine)
main_thread.start()

secondary_thread = threading.Thread(target=run_secondary_state_machine)
secondary_thread.start()