#!/usr/bin/env python
import sys
from xml.dom.minidom import parseString

def parseSVG(svg):
    svgF = open(svg)
    svgData = svgF.read()
    
    dom = parseString(svgData)

    rects = dom.getElementsByTagName('rect')
    paths = dom.getElementsByTagName('path')
    
    outputString = "[\"" + svg + "\", \"player\", [2450, 2490], 0, ["

    
    for r in rects:
        #  print(r.getAttributeNode('id').nodeValue)
        outputString += ("[0,")
        outputString += ("\"" + r.getAttributeNode('style').nodeValue.split(";")[0].split(":")[1] + "\",")
        outputString += ("[" + str(round(float(r.getAttributeNode('width').nodeValue))) + ",")
        outputString += (str(round(float(r.getAttributeNode('height').nodeValue))) + "],")
        outputString += ("[" + str(round(float(r.getAttributeNode('x').nodeValue))) + ",")
        outputString += (str(round(float(r.getAttributeNode('y').nodeValue))) + "],")
        outputString += ("\"" + r.getAttributeNode('id').nodeValue + "\"")
        outputString += ("],\n");

    for p in paths:
        outputString += ("[1,")

        pa = p.getAttributeNode('d').nodeValue.split()
        c = p.getAttributeNode('style').nodeValue.split(";")[0].split(":")[1]
        pid = p.getAttributeNode('id').nodeValue

        if c not in colourMap:
            colourMap.append(c)
            cm = (len(colourMap) - 1)
        else:
            cm = colourMap.index(c)


        pc = str(cm) + ","

        outputString += (pc)
        outputString += ("[")
            
        for xy in pa:
            if xy != "M" and xy != "C" and xy != "L" and xy != "z":
                x = (str(round(float(xy.split(",")[0]))))
                y = (str(round(float(xy.split(",")[1]))))
                outputString += ("[" + x + "," + y + "],")


        outputString += ("],\n")
        outputString += "\"" + pid + "\""
        outputString += ("],\n")
                      
    outputString += "]],"
    print(outputString)
 #   for i in colourMap:
  #      print("[\"" + str(colourMap.index(i)) + "\", \"" + i  + "\"]")



f = open(sys.argv[1])

assetData = f.readlines()
colourMap = []

for svgFile in assetData:
    parseSVG(svgFile.strip())

print((colourMap))

