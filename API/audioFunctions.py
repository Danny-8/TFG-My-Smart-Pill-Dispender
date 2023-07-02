'''
    Functions for the audio manupulation
'''
import pygame
import os
from gtts import gTTS

def playAudio(name):
    full_route = None
    
    # Busca el archivo en las carpetas a partir de donde se ejecuta el código
    for root, dirs, files in os.walk('.'):
        if name in files:
            full_route = os.path.join(root, name)
            break
    
    if full_route:
        # Inicializa el mixer de pygame
        pygame.mixer.init()
        
        # Carga el archivo de audio
        pygame.mixer.music.load(full_route)
        
        # Reproduce el audio
        pygame.mixer.music.play()
        
        # Espera a que termine de reproducirse
        while pygame.mixer.music.get_busy():
            pass
    else:
        print(f"No se encontró el archivo {name} en ninguna carpeta a partir de {os.getcwd()}")


def textToAudio(texto):

    # crear objeto gTTS y generar el archivo de audio
    tts = gTTS(texto, lang='es')
    tts.save('audio.mp3')

    # inicializar Pygame
    pygame.mixer.init()


    # cargar el archivo de audio en un objeto Sound de Pygame
    sound = pygame.mixer.music.load("audio.mp3")

    # reproducir el audio
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        pass

    # detener Pygame
    pygame.quit()

    # borrar el archivo de audio
    os.remove('audio.mp3')