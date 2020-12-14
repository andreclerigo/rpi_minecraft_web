import json
import sqlite3
from os import listdir
from os.path import isfile, join

fileNames = [f for f in listdir("/opt/minecraft/server/world/stats") if isfile(join("/opt/minecraft/server/world/stats", f))]
conn = sqlite3.connect('stats.db')
c = conn.cursor()

# Debug
#for x in fileNames:
#    print(x)
print("O servidor ja teve " + str(len(fileNames)) + " players")

for x in fileNames:
    path = "/opt/minecraft/server/world/stats/" + str(x)
    with open(path, "r") as read_file:
        data = json.load(read_file)

    #print(json.dumps(data["stats"], indent=4))
    horas = int(data["stats"]["minecraft:custom"]["minecraft:play_one_minute"] / 20 / 60 / 60)

    print("Player " + x[:-5] + " tem " + str(horas) + " horas jogadas")
    #c.execute("CREATE TABLE PLAYERS(id INTEGER PRIMARY KEY AUTOINCREMENT, uuid TEXT, hours INTEGER)")
    #c.execute("INSERT INTO PLAYERS (uuid, hours) VALUES (\'" + x + "\'," + str(horas) + ")")
    c.execute("UPDATE PLAYERS SET hours =" + str(horas) + " WHERE uuid = \'" + x + "\'")

conn.commit()