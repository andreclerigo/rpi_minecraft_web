#!/usr/bin/python
import os
import sys
import json
import operator
import mariadb
#os.system('python3 -m pip install {}'.format(sys.argv[1]))
from os import listdir
from os.path import isfile, join

dir_world = "/opt/minecraft/server/world/"

# Creating List of stats/*.json files
fileNames = [f for f in listdir(dir_world + "stats/") if isfile(join(dir_world + "stats/", f))]

# Dictionary that links uuid to nickname
with open(dir_world + "../usercache.json", "r") as f:
    playerList = json.load(f)

dictN = {}
for i in range(len(playerList)):
    dictN[playerList[i]["uuid"]] = playerList[i]["name"]

hoursTops = {}
deathsTops = {}
# Create tops
def createTops():
    for player in fileNames:
        path = dir_world + "stats/" + str(player)
        with open(path, "r") as f:
            data = json.load(f)

        hours = int(data["stats"]["minecraft:custom"]["minecraft:play_one_minute"] / 20 / 60 / 60)  # Converts ticks to hours
        
        try:
            deaths = data["stats"]["minecraft:custom"]["minecraft:deaths"]
        except:
            deaths = 0

        # Debug
        # print(dictN.get(player[:-5]) + " tem " + str(hours) + " horas jogadas e já morreu " + str(deaths) + " vezes.")
        hoursTops[dictN.get(player[:-5])] = hours
        deathsTops[dictN.get(player[:-5])] = deaths
createTops()

sorted_h = dict( sorted(hoursTops.items(), key=operator.itemgetter(1),reverse=True))
sorted_d = dict( sorted(deathsTops.items(), key=operator.itemgetter(1),reverse=True))

def acessDatabase():
    conn = mariadb.connect(
        user="exampleuser",
        password="pimylifeup",
        host="localhost",
        port=3306,
        database="exampledb")
    cur = conn.cursor()
    for i in range(0, 12):
        '''
        cur.execute("INSERT INTO Leaderboard (id, NickHours, horas, NickDeaths, deaths) VALUES (?, ?, ?, ?, ?)",
                                                                                    (i,
                                                                                    list(sorted_h.keys())[i], 
                                                                                    list(sorted_h.values())[i],
                                                                                    list(sorted_d.keys())[i],
                                                                                    list(sorted_d.values())[i]))
        '''
        cur.execute("UPDATE Leaderboard SET NickHours=?, horas=?, NickDeaths=?, deaths=? WHERE id=?",
                                                                                    (list(sorted_h.keys())[i], 
                                                                                    list(sorted_h.values())[i],
                                                                                    list(sorted_d.keys())[i],
                                                                                    list(sorted_d.values())[i],
                                                                                    i))
                                                                            
    conn.commit() 
    conn.close()                                        
acessDatabase()

sys.exit()
