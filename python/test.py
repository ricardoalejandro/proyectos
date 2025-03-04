import random

# Lista de nombres de animales
animales = [
    "perro", "gato", "caballo", "vaca", "cerdo", 
    "oveja", "pato", "conejo", "león", "elefante", 
    "jirafa", "tigre", "oso", "zorro", "lobo"
]

# Selecciona aleatoriamente 10 nombres únicos
lista_animales = random.sample(animales, 10)

print(lista_animales)